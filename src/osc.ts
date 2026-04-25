import { InstanceBaseExt, ZoomVersion } from './utils.js'
import { CompanionVariableValues, InstanceStatus, OSCSomeArguments } from '@companion-module/base'
import { ZoomConfig } from './config.js'
import { FeedbackId } from './feedback.js'
import { updateAllUserBasedVariables } from './variables/variable-values.js'
import { sendOscCommand, sendZoomIsoPullingCommands } from './osc/commands.js'
import { dispatchOscMessage } from './osc/handlers/index.js'
import { OSCHandlerContext, UserRole, ZoomOSCResponse } from './osc/types.js'
const osc = require('osc') // eslint-disable-line

export class OSC {
	private readonly instance: InstanceBaseExt<ZoomConfig>
	private oscHost = ''
	private oscTXPort = 9099
	private oscRXPort = 1234
	private udpPort: any
	private updateLoop = true
	private firstLoop = true
	private spotlightGroupTrackingInitalized = false
	private needToPingPong = true
	private pingInterval: NodeJS.Timeout | undefined | null = null
	private pingIntervalTime = 2000
	private updatePresetsLoop: NodeJS.Timeout | undefined | null = null
	private zoomISOPuller: NodeJS.Timeout | undefined | null = null

	constructor(instance: InstanceBaseExt<ZoomConfig>) {
		this.instance = instance
		// Connect to ZoomOSC
		this.Connect()
	}

	/**
	 * @description Close connection on instance disable/removal
	 */
	public readonly destroy = (): void => {
		if (this.udpPort) this.udpPort.close()
		this.destroyTimers()
		return
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
		if (this.instance.config.version === (ZoomVersion.ZoomISO as number)) {
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
		} else {
			this.destroyZoomIsoPullerTimer()
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

		this.udpPort = new osc.UDPPort({
			localAddress: '0.0.0.0',
			localPort: this.oscRXPort,
			metadata: true,
		})

		// Listen for incoming OSC messages.
		this.udpPort.on('message', (oscMsg: ZoomOSCResponse) => {
			// this.instance.log('info', JSON.stringify(oscMsg))
			// eslint-disable-next-line  @typescript-eslint/no-floating-promises
			this.processData(oscMsg)
		})

		this.udpPort.on('error', (err: { code: string; message: string }) => {
			if (err.code === 'EADDRINUSE') {
				this.instance.log('error', 'Error: Selected port in use.' + err.message)
			}
		})

		// Open the socket.
		this.udpPort.open()

		// When the port is read
		this.udpPort.on('ready', () => {
			this.instance.log('info', `Listening to ZoomOSC on port: ${this.oscRXPort}`)
			this.instance.updateStatus(InstanceStatus.Connecting, 'Listening for first response')
			// See if ZoomOSC is active
			this.needToPingPong = true
			this.createPingTimer()
			this.createUpdatePresetsTimer()
		})

		return
	}

	/**
	 * Create a new user when none existing was found
	 * Normally this function should not be called
	 * @param data ZoomOSCResponse
	 * @returns promise
	 */
	private createZoomUser = async (data: ZoomOSCResponse) => {
		const zoomId = parseInt(data.args[3].value)
		// Only when a user is not in offline array
		if (!this.instance.ZoomUserOffline[zoomId]) {
			const index = this.instance.ZoomVariableLink.findIndex((id: { zoomId: number }) => id.zoomId === zoomId)
			if (index === -1) {
				this.instance.ZoomVariableLink.push({ zoomId, userName: data.args[1].value })
			}
			if (data.args.length == 4) {
				this.instance.ZoomUserData[zoomId] = {
					zoomId,
					targetIndex: data.args[0].value,
					userName: data.args[1].value,
					galleryIndex: data.args[2].value,
					users: [],
				}
			} else if (data.args.length >= 10) {
				// {int targetIndex}
				// {str userName}
				// {int galleryIndex}
				// {int zoomID}
				// {int targetCount}
				// {int listCount}
				// {int userRole}
				// {int onlineStatus}
				// {int videoStatus}
				// {int audioStatus}
				// {int handRaised}
				// this.instance.log('debug', `${data.args[1].value}, user role ${data.args[6].value}`)
				this.instance.ZoomUserData[zoomId] = {
					zoomId,
					targetIndex: data.args[0].value,
					userName: data.args[1].value,
					galleryIndex: data.args[2].value,
					userRole: data.args[6].value,
					videoOn: data.args[8].value === 1 ? true : false,
					mute: data.args[9].value === 0 ? true : false,
					handRaised: data.args[10].value === 1 ? true : false,
					users: [],
				}
				if (data.args[6].value === UserRole.Host || data.args[6].value === UserRole.CoHost) {
					const index = this.instance.ZoomGroupData[0].users.findIndex((id) => id.zoomID === zoomId)
					if (index === -1) {
						this.instance.ZoomGroupData[0].users.push({
							zoomID: zoomId,
							userName: data.args[1].value,
						})
					}
				}
			} else {
				this.instance.log('warn', 'create ZoomUser wrong arguments in OSC feedback')
			}
			this.instance.InitVariables()
			const variables: CompanionVariableValues = {}
			updateAllUserBasedVariables(this.instance, variables)
			this.instance.setVariableValues(variables)
			// this.instance.UpdateVariablesValues()
		}
	}

	private readonly createHandlerContext = (): OSCHandlerContext => ({
		instance: this.instance,
		createZoomUser: this.createZoomUser,
		setUpdateLoop: (value) => {
			this.updateLoop = value
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
		// Do a switch block to go fast through the rest of the data
		try {
			await dispatchOscMessage(this.createHandlerContext(), data)
		} catch (error) {
			this.instance.log('error', `unable to process data for ${JSON.stringify(data)}. Error: ${JSON.stringify(error)}`)
		}
	}

	/**
	 * @param command function and any params
	 * @description Check OSC connection status and format command to send to Zoom
	 */
	public readonly sendCommand = (path: string, args?: OSCSomeArguments): void => {
		// this.instance.log('debug', `sending ${JSON.stringify(path)} ${args ? JSON.stringify(args) : ''}`)
		try {
			sendOscCommand(this.udpPort, this.oscHost, this.oscTXPort, path, args)
		} catch (error) {
			this.instance.log(
				'error',
				`sendCommand error for path: ${path} and args: ${JSON.stringify(args)}. Error: ${JSON.stringify(error)}`,
			)
		}
	}

	public readonly sendISOPullingCommands = (): void => {
		// this.instance.log('debug', 'sendISOPullingCommands')
		sendZoomIsoPullingCommands(this.sendCommand)
		return
	}
}
