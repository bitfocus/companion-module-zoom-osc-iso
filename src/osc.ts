import type ModuleInstance from './index.js'
import { ZoomVersion } from './utils.js'
import { InstanceStatus, type OSCSomeArguments } from '@companion-module/base'
import { FeedbackId } from './feedback.js'
import { sendZoomIsoPullingCommands } from './osc/commands.js'
import { dispatchOscMessage } from './osc/handlers/index.js'
import { closeOscPort, createOscPort, toOutgoingMessage, toZoomOSCResponse, type OscPort } from './osc/transport.js'
import type { OSCHandlerContext, ZoomOSCResponse } from './osc/types.js'
import { createZoomUser } from './osc/users.js'
import { checkForwardTarget, forwardTargetFromConfig, OscForwarder } from './osc/forwarder.js'
import { setVariables } from './osc/variables.js'
import { updateOscForwardingVariables } from './variables/variable-values.js'

export class OSC {
	private readonly instance: ModuleInstance
	private oscHost = ''
	private oscTXPort = 9090
	private oscRXPort = 1234
	/** Receives from ZoomOSC/ISO and sends commands to it, on the receiving port, as in 4.11 */
	private udpPort: OscPort | null = null
	/** Sends a copy of every packet from ZoomOSC/ISO to one other application, while OSC forwarding is on */
	private forwarder: OscForwarder | null = null
	/** Whether ZoomOSC/ISO has answered a ping since this connection started */
	private hadFirstPong = false
	private updateLoop = true
	private firstLoop = true
	private spotlightGroupTrackingInitalized = false
	private needToPingPong = true
	private pingInterval: NodeJS.Timeout | undefined | null = null
	private pingIntervalTime = 2000
	private updatePresetsLoop: NodeJS.Timeout | undefined | null = null
	private zoomISOPuller: NodeJS.Timeout | undefined | null = null

	constructor(instance: ModuleInstance) {
		this.instance = instance
		// Connect to ZoomOSC
		this.Connect()
	}

	/**
	 * @description Close connection on instance disable/removal
	 */
	public readonly destroy = async (): Promise<void> => {
		this.destroyTimers()

		const udpPort = this.udpPort
		this.udpPort = null
		if (udpPort) {
			await closeOscPort(udpPort)
		}
		const forwarder = this.forwarder
		this.forwarder = null
		await forwarder?.close()
	}

	public readonly destroyTimers = (): void => {
		this.instance.log('debug', 'destroyTimers')
		this.updateLoop = false
		this.firstLoop = false
		this.needToPingPong = false
		this.destroyPingTimer()
		this.destroyUpdatePresetsTimer()
		this.destroyZoomIsoPullerTimer()
	}

	private readonly destroyPingTimer = (): void => {
		if (this.pingInterval) {
			clearInterval(this.pingInterval)
			this.pingInterval = null
		}
	}

	private readonly destroyUpdatePresetsTimer = (): void => {
		if (this.updatePresetsLoop) {
			clearInterval(this.updatePresetsLoop)
			this.updatePresetsLoop = null
		}
	}

	private readonly destroyZoomIsoPullerTimer = (): void => {
		if (this.zoomISOPuller) {
			clearInterval(this.zoomISOPuller)
			this.zoomISOPuller = null
		}
	}

	public readonly createZoomIsoPullerTimer = (): void => {
		// a join can report Audio Ready and then In Meeting: replace the timer rather than leave one running untracked
		this.destroyZoomIsoPullerTimer()
		if (this.instance.config.version === ZoomVersion.ZoomISO) {
			this.zoomISOPuller = setInterval(
				() => {
					if (this.instance.ZoomClientDataObj.engineState === -1) {
						this.sendCommand('/zoom/getEngineState', [])
					} else {
						this.sendISOPullingCommands()
					}
				},
				this.instance.config.pulling < 1000 ? 5000 : this.instance.config.pulling,
			)
		}
	}

	public readonly createPingTimer = (): void => {
		if (this.pingInterval) clearInterval(this.pingInterval)
		this.pingInterval = setInterval(() => {
			if (this.needToPingPong) {
				// this.instance.log('debug', `**************** needToPingPong ${new Date()}.  Interval: ${this.pingIntervalTime}`)
				// Shall we leave this?
				this.instance.updateStatus(InstanceStatus.Connecting, 'checking connection')
				this.sendCommand('/zoom/ping')
			}
		}, this.pingIntervalTime)
	}

	public readonly createUpdatePresetsTimer = (): void => {
		// start looping for presets
		if (this.updatePresetsLoop) clearInterval(this.updatePresetsLoop)
		this.updatePresetsLoop = setInterval(() => {
			if (this.updateLoop) {
				if (this.instance.config.enableActionPresetAndFeedbackSync || this.firstLoop) {
					// this.instance.log('debug', `**************** updateLoop ${new Date()}`)
					this.instance.updateDefinitionsForActionsFeedbacksAndPresets()
					// Make sure initial status is reflected
					this.instance.checkFeedbacks(
						FeedbackId.userNameBased,
						FeedbackId.userNameBasedAdvanced,
						FeedbackId.indexBased,
						FeedbackId.indexBasedAdvanced,
						FeedbackId.galleryBased,
						FeedbackId.galleryBasedAdvanced,
						FeedbackId.groupBased,
						FeedbackId.groupBasedAdvanced,
						FeedbackId.selectionMethod,
						FeedbackId.audioOutput,
						FeedbackId.output,
					)

					this.firstLoop = false
				}
				this.updateLoop = false
			}
		}, 2000)
	}
	/**
	 * @description Create a OSC connection to Zoom
	 */
	public readonly Connect = (): void => {
		this.oscHost = this.instance.config.host || '127.0.0.1'
		this.oscTXPort = this.instance.config.tx_port || 9090
		this.oscRXPort = this.instance.config.rx_port || 1234

		this.instance.updateStatus(InstanceStatus.Connecting)
		this.hadFirstPong = false
		const udpPort = createOscPort(this.oscRXPort, this.oscHost, this.oscTXPort)
		this.udpPort = udpPort
		this.updateForwarding()

		// each packet's bytes, before osc decodes them: forwarded exactly as they arrived, even one osc can't read.
		// Only packets that arrive on the receiving port come in here, never the commands this module sends.
		udpPort.on('raw', (data) => this.forwarder?.forward(data))

		// every message, including each one inside a bundle
		udpPort.on('message', (oscMsg) => {
			// eslint-disable-next-line  @typescript-eslint/no-floating-promises
			this.processData(toZoomOSCResponse(oscMsg))
		})

		udpPort.on('error', (err) => {
			if (err.code === 'EADDRINUSE') {
				this.instance.log('error', 'Error: Selected port in use.' + err.message)
				return
			}
			// anything else, such as a packet osc can't read: log every one, rather than drop it without a trace
			this.instance.log('warn', `OSC error from ZoomOSC/ISO: ${err.message}`)
		})

		udpPort.on('ready', () => {
			this.instance.log('info', `Listening to ZoomOSC on port: ${this.oscRXPort}`)
			this.instance.updateStatus(InstanceStatus.Connecting, 'Listening for first response')
			this.needToPingPong = true
			this.createPingTimer()
			this.createUpdatePresetsTimer()
		})

		udpPort.open()

		return
	}

	/**
	 * Starts, stops or re-targets OSC forwarding to match the config, without touching the connection to ZoomOSC/ISO.
	 * Runs when the connection starts, and when the forwarding actions or settings change.
	 */
	public readonly updateForwarding = (): void => {
		const previous = this.forwarder
		this.forwarder = null
		void previous?.close()

		const config = this.instance.config
		// a connection that has stopped forwards nothing
		if (this.udpPort && config.enableOscForwarding) {
			const target = forwardTargetFromConfig(config)
			const problem = checkForwardTarget(target, this.oscRXPort, this.oscHost, this.oscTXPort)
			if (problem) {
				this.instance.log('error', `OSC forwarding can't start: ${problem}`)
			} else {
				this.forwarder = new OscForwarder(target, (level, message) => this.instance.log(level, message))
				this.instance.log('info', `Forwarding all OSC from ZoomOSC/ISO to ${target.host}:${target.port}`)
			}
		} else if (previous) {
			this.instance.log('info', 'OSC forwarding is off')
		}

		setVariables(this.instance, (variables) => updateOscForwardingVariables(this.instance, variables))
		this.instance.checkFeedbacks(FeedbackId.oscForwarding)
	}

	/** Whether every packet from ZoomOSC/ISO is being forwarded right now */
	public readonly isForwarding = (): boolean => this.forwarder !== null

	/**
	 * Create a new user when none existing was found
	 * Normally this function should not be called
	 * @param data ZoomOSCResponse
	 * @returns promise
	 */
	private createZoomUser = async (data: ZoomOSCResponse) => {
		await createZoomUser(this.instance, data)
	}

	private readonly createHandlerContext = (): OSCHandlerContext => ({
		instance: this.instance,
		createZoomUser: this.createZoomUser,
		setUpdateLoop: (value) => {
			this.updateLoop = value
		},
		setNeedToPingPong: (value) => {
			this.needToPingPong = value
		},
		isSpotlightGroupTrackingInitialized: () => this.spotlightGroupTrackingInitalized,
		setSpotlightGroupTrackingInitialized: (value) => {
			this.spotlightGroupTrackingInitalized = value
		},
		destroyTimers: this.destroyTimers,
		createPingTimer: this.createPingTimer,
		createUpdatePresetsTimer: this.createUpdatePresetsTimer,
		createZoomIsoPullerTimer: this.createZoomIsoPullerTimer,
		destroyZoomIsoPullerTimer: this.destroyZoomIsoPullerTimer,
		hasZoomIsoPuller: () => Boolean(this.zoomISOPuller),
		isFirstPong: () => {
			const first = !this.hadFirstPong
			this.hadFirstPong = true
			return first
		},
		configureConnectedPingWatchdog: (callStatus) => {
			this.needToPingPong = false
			if (this.pingInterval) {
				this.destroyPingTimer()
				this.pingIntervalTime = 60000
				if (callStatus === 1) {
					this.pingInterval = setInterval(() => {
						if (Date.now() - this.instance.ZoomClientDataObj.last_response > 60000) {
							this.sendCommand('/zoom/ping')
						}
					}, this.pingIntervalTime)
				} else {
					this.destroyTimers()
				}
			}
		},
		sendCommand: this.sendCommand,
	})

	private processData = async (data: ZoomOSCResponse) => {
		// this.instance.log('debug', '+++++++++++receiving:' + JSON.stringify(data))
		try {
			await dispatchOscMessage(this.createHandlerContext(), data)
		} catch (error) {
			// an Error has no enumerable fields: JSON.stringify gives {}, which hid the cause in the log
			const reason = error instanceof Error ? error.message : JSON.stringify(error)
			this.instance.log('error', `unable to process data for ${JSON.stringify(data)}. Error: ${reason}`)
		}
	}

	/**
	 * @param command function and any params
	 * @description Check OSC connection status and format command to send to Zoom
	 */
	public readonly sendCommand = (path: string, args?: OSCSomeArguments): void => {
		// this.instance.log('debug', `sending ${JSON.stringify(path)} ${args ? JSON.stringify(args) : ''}`)
		const logError = (error: unknown) =>
			this.instance.log(
				'error',
				`sendCommand error for path: ${path} and args: ${JSON.stringify(args)}. Error: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
			)
		try {
			if (!this.udpPort) {
				throw new Error('OSC port is not open')
			}
			// to ZoomOSC/ISO's IP and receiving port; osc reports socket errors through 'error'
			this.udpPort.send(toOutgoingMessage(path, args))
		} catch (error) {
			logError(error)
		}
	}

	public readonly sendISOPullingCommands = (): void => {
		// this.instance.log('debug', 'sendISOPullingCommands')
		sendZoomIsoPullingCommands(this.sendCommand, this.instance.config)
		return
	}
}
