import ZoomInstance from '.'
import { OSCSomeArguments } from '../../../instance_skel_types'
const osc = require('osc')

interface ZoomOSCResponse {
	address: string
	args: {
		type: string
		value: any
	}[]
}
enum ZoomVersion {
	ZoomOSC = 0,
	ZoomISO = 1,
}
enum SubscribeMode {
	None = 0,
	TargetList = 1,
	All = 2,
	Panelists = 3,
	OnlyGallery = 4,
}

export class OSC {
	private readonly instance: ZoomInstance
	private oscHost: string = ''
	private oscTXPort: number = 9099
	private oscRXPort: number = 1234
	private udpPort: any
	private updateLoop: boolean = true
	private needToPingPong: boolean = true
	private pingInterval: NodeJS.Timer | undefined
	private pingIntervalTime: number = 2000
	private updatePresetsLoop: NodeJS.Timer | undefined
	private zoomISOPuller: NodeJS.Timer | undefined

	constructor(instance: ZoomInstance) {
		this.instance = instance

		this.instance.updateVariables()
		// Connect to ZoomOSC
		this.Connect()
			.then(() => {
				this.instance.status(this.instance.STATUS_WARNING, 'Listening for first command')
				this.instance.showLog('debug', 'ZoomOSC listener active')
			})
			.catch(() => {
				this.instance.log('warn', `Unable to connect, please configure a host and port in the instance configuration`)
				this.instance.status(this.instance.STATUS_ERROR, 'wrong settings')
			})
	}

	/**
	 * @description Close connection on instance disable/removal
	 */
	public readonly destroy = (): void => {
		this.needToPingPong = false
		if (this.udpPort) this.udpPort.close()
		if (this.pingInterval) clearInterval(this.pingInterval)
		if (this.updatePresetsLoop) clearInterval(this.updatePresetsLoop)
		if (this.zoomISOPuller) clearInterval(this.zoomISOPuller)
	}

	/**
	 * @description Create a OSC connection to Zoom
	 */
	public readonly Connect = () => {
		let p = new Promise((resolve, reject) => {
			if (this.oscHost === undefined || this.oscTXPort === undefined) {
				reject('no host or port in database')
			}
			this.oscHost = this.instance.config.host
			this.oscTXPort = this.instance.config.tx_port
			this.oscRXPort = this.instance.config.rx_port

			this.udpPort = new osc.UDPPort({
				localAddress: '0.0.0.0',
				localPort: this.oscRXPort,
				metadata: true,
			})

			// Listen for incoming OSC messages.
			this.udpPort.on('message', (oscMsg: ZoomOSCResponse) => {
				this.processData(oscMsg)
			})

			this.udpPort.on('error', (err: { code: string; message: string }) => {
				if (err.code === 'EADDRINUSE') {
					this.instance.showLog('error', 'Error: Selected port in use.' + err.message)
					reject('port in use')
				}
			})

			// Open the socket.
			this.udpPort.open()

			// When the port is read
			this.udpPort.on('ready', () => {
				this.instance.log('debug', `Listening to ZoomOSC on port: ${this.oscRXPort}`)
				// See if ZoomOSC is active
				this.pingInterval = setInterval(() => {
					if (this.needToPingPong) {
						this.sendCommand('/zoom/ping')
					}
				}, this.pingIntervalTime)
				// start looping for presets
				this.updatePresetsLoop = setInterval(() => {
					if (this.updateLoop) {
						this.instance.updateInstance()
						this.updateLoop = false
						// Make sure initial status is reflected
						this.instance.checkFeedbacks('indexBased')
						this.instance.checkFeedbacks('galleryBased')
						this.instance.checkFeedbacks('groupBased')
						this.instance.checkFeedbacks('selectionMethod')
						this.instance.checkFeedbacks('userNameBased')
					}
				}, 2000)
				resolve('ready for OSC')
			})
		})
		return p
	}

	/**
	 * Create a new user when none existing was found
	 * Normally this function should not be called
	 * @param data ZoomOSCResponse
	 * @returns promise
	 */
	private createZoomUser = async (data: ZoomOSCResponse) => {
		let zoomId = parseInt(data.args[3].value)
		// Only when a user is not in offline array
		if (!this.instance.ZoomUserOffline[zoomId]) {
			let index = this.instance.ZoomVariableLink.findIndex((id) => id.zoomId === zoomId)
			if (index === -1) this.instance.ZoomVariableLink.push({ zoomId, userName: data.args[1].value })
			if (data.args.length == 4) {
				this.instance.ZoomUserData[zoomId] = {
					zoomId,
					targetIndex: data.args[0].value,
					userName: data.args[1].value,
					galleryIndex: data.args[2].value,
					users: [],
				}
			} else if (data.args.length > 8) {
				this.instance.ZoomUserData[zoomId] = {
					zoomId,
					targetIndex: data.args[0].value,
					userName: data.args[1].value,
					galleryIndex: data.args[2].value,
					videoOn: data.args[8].value === 1 ? true : false,
					mute: data.args[9].value === 0 ? true : false,
					handRaised: data.args[10].value === 1 ? true : false,
					users: [],
				}
			} else {
				this.instance.showLog('debug', 'wrong arguments in OSC feedback')
			}
			this.instance.updateVariables()
		}
	}

	private processData = async (data: ZoomOSCResponse) => {
		let recvMsg = data.address.toString().split('/')
		let zoomPart1 = recvMsg[1] // zoom, zoomosc
		let zoomPart2 = recvMsg[2] // user, me, pong, galleryShape etc.
		let zoomPart3 = recvMsg[3]
		let zoomId: number

		// Do a switch block to go fast through the rest of the data
		if (zoomPart1 == 'zoomosc') {
			this.instance.status(this.instance.STATUS_OK)
			this.instance.ZoomClientDataObj.last_response = Date.now()
			switch (zoomPart2) {
				case 'me':
				// let isMe = true
				/* falls through */
				case 'user':
					// Set for all cases the ZoomCallerId
					zoomId = parseInt(data.args[3].value)
					// Check if user exists, returns -1 if not
					if (!this.instance.ZoomUserData[zoomId]) {
						if (this.instance.ZoomUserOffline[zoomId]) {
							// The zoomID was already there so this probably is a ghost ID
							this.instance.showLog('console', 'User just went offline, do nothing')
						} else {
							await this.createZoomUser(data)
						}
						// what to do if nothing has been found?
					}

					switch (zoomPart3) {
						case 'list':
							// this.instance.showLog('OSC', 'receiving list data' + JSON.stringify(data))
							// {int targetIndex}, {str userName}, {int galleryIndex}, {int zoomID}
							// {int targetCount}
							// {int listCount}
							// {int userRole}
							// {int onlineStatus}
							// {int videoStatus}
							// {int audioStatus}
							// {int handRaised}
							this.createZoomUser(data).then(() => (this.updateLoop = true))
							break
						case 'activeSpeaker':
							if (this.instance.ZoomClientDataObj.activeSpeaker !== data.args[1].value) {
								this.instance.showLog('OSC', 'receiving:' + JSON.stringify(data))
								this.instance.ZoomClientDataObj.activeSpeaker = data.args[1].value
								this.instance.variables?.updateVariables()
								this.instance.checkFeedbacks('indexBased')
								this.instance.checkFeedbacks('userNameBased')
								this.instance.checkFeedbacks('galleryBased')
								this.instance.checkFeedbacks('groupBased')
							}
							break
						case 'videoOn':
							this.instance.showLog('OSC', 'receiving:' + JSON.stringify(data))
							this.instance.ZoomUserData[zoomId].videoOn = true
							this.instance.checkFeedbacks('indexBased')
							this.instance.checkFeedbacks('galleryBased')
							this.instance.checkFeedbacks('groupBased')

							break
						case 'videoOff':
							this.instance.showLog('OSC', 'receiving:' + JSON.stringify(data))
							this.instance.ZoomUserData[zoomId].videoOn = false
							this.instance.checkFeedbacks('indexBased')
							this.instance.checkFeedbacks('galleryBased')
							this.instance.checkFeedbacks('groupBased')

							break
						case 'mute':
							this.instance.showLog('OSC', 'receiving:' + JSON.stringify(data))
							this.instance.ZoomUserData[zoomId].mute = true
							this.instance.checkFeedbacks('indexBased')
							this.instance.checkFeedbacks('galleryBased')
							this.instance.checkFeedbacks('groupBased')

							break
						case 'unMute':
							this.instance.showLog('OSC', 'receiving:' + JSON.stringify(data))
							this.instance.ZoomUserData[zoomId].mute = false
							this.instance.checkFeedbacks('indexBased')
							this.instance.checkFeedbacks('galleryBased')
							this.instance.checkFeedbacks('groupBased')
							break
						case 'handRaised':
							this.instance.showLog('OSC', 'receiving:' + JSON.stringify(data))
							this.instance.ZoomUserData[zoomId].handRaised = true
							this.instance.checkFeedbacks('indexBased')
							this.instance.checkFeedbacks('galleryBased')
							this.instance.checkFeedbacks('groupBased')
							break
						case 'handLowered':
							this.instance.showLog('OSC', 'receiving:' + JSON.stringify(data))
							this.instance.ZoomUserData[zoomId].handRaised = false
							this.instance.checkFeedbacks('indexBased')
							this.instance.checkFeedbacks('galleryBased')
							this.instance.checkFeedbacks('groupBased')

							break
						case 'online':
							this.instance.showLog('OSC', 'receiving:' + JSON.stringify(data))
							this.createZoomUser(data).then(() => (this.updateLoop = true))
							break
						case 'offline':
							this.instance.showLog('OSC', 'receiving:' + JSON.stringify(data))
							this.instance.ZoomUserOffline[zoomId] = this.instance.ZoomUserData[zoomId]
							delete this.instance.ZoomUserData[zoomId]
							let index = this.instance.ZoomVariableLink.findIndex((id) => id.zoomId === zoomId)
							this.instance.showLog('debug', 'Removed:' + this.instance.ZoomVariableLink.splice(index, 1))
							this.updateLoop = true
							break
						case 'userNameChanged':
							this.instance.showLog('OSC', 'receiving:' + JSON.stringify(data))
							this.instance.ZoomUserData[zoomId].userName = data.args[1].value
							let findIndex = this.instance.ZoomVariableLink.findIndex((id) => id.zoomId === zoomId)
							this.instance.ZoomVariableLink[findIndex].userName = data.args[1].value
							this.instance.variables?.updateVariables()
							break
						case 'chat':
							this.instance.showLog('OSC', 'receiving:' + JSON.stringify(data))
							break
						case 'roleChanged':
							this.instance.showLog('OSC', 'receiving:' + JSON.stringify(data))
							this.instance.ZoomUserData[zoomId].userRole = data.args[4].value
							break
						case 'stoppedSpeaking':
							// this.instance.showLog('OSC','receiving:' + data)
							// create feedback for this?
							break
						case 'isSpeaking':
							this.instance.ZoomClientDataObj.isSpeaking = data.args[1].value
							this.instance.variables?.updateVariables()
							// this.instance.checkFeedbacks('indexBased')
							// this.instance.checkFeedbacks('galleryBased')
							// this.instance.checkFeedbacks('groupBased')
							break

						default:
							this.instance.showLog('console', 'No Case provided for:' + data.address)
							this.instance.showLog('console', 'Arguments' + JSON.stringify(data.args))
					}
					break

				case 'galleryShape':
					// {int rows} {int cols} only for mac, skip this
					break

				case 'galleryOrder':
					this.instance.ZoomClientDataObj.galleryOrder.length = 0
					data.args.forEach((order: { type: string; value: number }) => {
						this.instance.ZoomClientDataObj.galleryOrder.push(order.value)
					})
					this.instance.variables?.updateDefinitions()
					this.instance.variables?.updateVariables()
					this.instance.checkFeedbacks('selectedUser')
					this.instance.checkFeedbacks('indexBased')
					this.instance.checkFeedbacks('galleryBased')
					this.instance.checkFeedbacks('groupBased')
					break

				case 'galleryCount':
					this.instance.ZoomClientDataObj.galleryCount = data.args[0].value
					this.instance.variables?.updateVariables()
					break

				case 'pong':
					this.instance.showLog('OSC', 'receiving:' + JSON.stringify(data))
					// {any pingArg (zero if none sent)}
					// {str zoomOSCversion}
					// {int subscribeMode}
					// {int galTrackMode}
					// {int callStatus 0 or 1}
					// {int number of targets}
					// {int number of users in call}
					// {int isPro (1=true, 0-false)}
					let versionInfo = data.args[1].value as string
					switch (versionInfo.substring(0, 4)) {
						case 'ZISO':
							this.instance.config.version = ZoomVersion.ZoomISO
							this.zoomISOPuller = setInterval(
								() => {
									if (this.instance.config.pulling !== 0) {
										this.sendISOPullingCommands()
									}
								},
								this.instance.config.pulling === 0 ? 5000 : this.instance.config.pulling
							)
							break
						case 'ZOSC':
							this.instance.config.version = ZoomVersion.ZoomOSC
							if (this.zoomISOPuller) clearInterval(this.zoomISOPuller)
							break
						default:
							// Default to ZoomOSC no pulling of data
							this.instance.config.version = ZoomVersion.ZoomOSC
							this.instance.showLog('console', `Wrong version status:${this.instance.ZoomClientDataObj.zoomOSCVersion}`)
							break
					}
					this.instance.saveConfig()
					this.instance.ZoomClientDataObj.zoomOSCVersion = data.args[1].value as string
					this.instance.ZoomClientDataObj.subscribeMode = data.args[2].value
					this.instance.ZoomClientDataObj.callStatus = data.args[4].value
					if (Object.keys(this.instance.ZoomUserData).length !== data.args[6].value)
						this.instance.showLog('console', `User data doesnt match with list info`)

					this.instance.variables?.updateVariables()
					this.needToPingPong = false
					if (this.pingInterval) {
						clearInterval(this.pingInterval)
						this.pingIntervalTime = 60000
						this.pingInterval = setInterval(() => {
							// When 60 seconds no response start pinging again
							if (Date.now() - this.instance.ZoomClientDataObj.last_response > 60000) {
								this.sendCommand('/zoom/ping')
							}
						}, this.pingIntervalTime)
					}

					// Subscribe to ZoomOSC
					this.sendCommand('/zoom/subscribe', [{ type: 'i', value: SubscribeMode.All }])
					this.sendCommand('/zoom/galTrackMode', [{ type: 'i', value: 1 }])
					// Start a loop to process incoming data in the backend
					this.updateLoop = true
					break

				case 'meetingStatus':
					this.instance.showLog('OSC', 'receiving:' + JSON.stringify(data))
					this.instance.ZoomClientDataObj.callStatus = data.args[0].value
					// Meeting status ended
					if (data.args[0].value === 0) {
						this.instance.ZoomClientDataObj.selectedCallers.length = 0
						this.instance.ZoomVariableLink.length = 0
						for (const key of Object.keys(this.instance.ZoomUserData)) {
							if (parseInt(key) > this.instance.ZoomClientDataObj.numberOfGroups) {
								delete this.instance.ZoomUserData[parseInt(key)]
							}
						}
						this.instance.variables?.updateVariables()
					}
					this.sendCommand('/zoom/ping')
					break

				case 'listCleared':
					this.instance.showLog('OSC', 'receiving:' + JSON.stringify(data))
					this.instance.ZoomClientDataObj.selectedCallers.length = 0
					this.instance.ZoomVariableLink.length = 0
					for (const key of Object.keys(this.instance.ZoomUserData)) {
						if (parseInt(key) > this.instance.ZoomClientDataObj.numberOfGroups) {
							delete this.instance.ZoomUserData[parseInt(key)]
						}
					}
					this.instance.variables?.updateVariables()
					break

				// ISO data
				case 'engineState':
					this.instance.ZoomClientDataObj.engineState = data.args[0].value
					this.instance.variables?.updateVariables()
					this.instance.checkFeedbacks('engineState')
					break
				case 'audioLevels':
					// this.instance.showLog('console', 'audioLevels' + data.address + JSON.stringify(data.args))
					this.instance.ZoomAudioLevelData[parseInt(data.args[0].value)] = {
						channel: parseInt(data.args[0].value),
						level: parseInt(data.args[1].value),
					}
					this.instance.updateVariables()
					break
				case 'audioRouting':
					this.instance.ZoomAudioRoutingData[parseInt(data.args[2].value)] = {
						audio_device: data.args[0].value,
						num_channels: parseInt(data.args[1].value),
						channel: parseInt(data.args[2].value),
						mode: data.args[3].value,
						gain_reduction: parseInt(data.args[4].value),
						selection: data.args[5].value,
					}
					this.instance.updateVariables()
					// this.instance.showLog('console', JSON.stringify(this.instance.ZoomAudioRoutingData))
					break
				case 'outputRouting':
					let outputNumber = parseInt(data.args[1].value)
					this.instance.ZoomOutputData[outputNumber] = {
						numberOfOutputs: data.args[0].value,
						outputNumber: data.args[1].value,
						enabled: data.args[2].value,
						outputName: data.args[3].value,
						mode: data.args[4].value,
						selection: data.args[5].value,
						resolution: data.args[6].value,
						embeddedAudioInfo: data.args[7].value,
						status: data.args[8].value,
					}
					this.instance.variables?.updateDefinitions()
					this.instance.variables?.updateVariables()
					break

				default:
					this.instance.showLog('console', 'No Case provided for:' + data.address)
					this.instance.showLog('console', 'Arguments' + JSON.stringify(data.args))
			}
		}
	}

	/**
	 * @param command function and any params
	 * @description Check OSC connection status and format command to send to Zoom
	 */
	public readonly sendCommand = (path: string, args?: OSCSomeArguments): void => {
		// this.instance.showLog('console', `sending ${JSON.stringify(path)} ${args ? JSON.stringify(args) : ''}`)
		this.udpPort.send(
			{
				address: path,
				args: args ? args : [],
			},
			this.oscHost,
			this.oscTXPort
		)
	}

	public readonly sendISOPullingCommands = () => {
		this.sendCommand('/zoom/getEngineState', [])
		this.sendCommand('/zoom/getAudioLevels', [])
		this.sendCommand('/zoom/getOutputRouting', [])
		this.sendCommand('/zoom/getAudioRouting', [])
	}

	/**
	 * @description Check for config changes and start new connections/polling if needed
	 */
	public readonly update = (): void => {
		const hostCheck = this.instance.config.host !== this.oscHost || this.instance.config.tx_port !== this.oscTXPort
		// if (this.instance.ZoomClientDataObj.subscribeMode !== this.instance.config.subscribeMode) {
		// 	this.instance.ZoomClientDataObj.subscribeMode = this.instance.config.subscribeMode
		// 	// this.sendCommand('/zoom/subscribe', { type: 'i', value: this.instance.ZoomClientDataObj.subscribeMode })
		// }
		if (hostCheck) {
			this.oscHost = this.instance.config.host
			this.oscRXPort = this.instance.config.rx_port
			this.oscTXPort = this.instance.config.tx_port
			this.instance.config = this.instance.config
			this.Connect()
		}
	}
}
