import { InstanceBaseExt, userExist, ZoomGroupDataInterface, ZoomVersion } from './utils'
import { InstanceStatus, OSCSomeArguments } from '@companion-module/base'
import { ZoomConfig } from './config'
import { FeedbackId } from './feedback'
const osc = require('osc') // eslint-disable-line

interface ZoomOSCResponse {
	address: string
	args: {
		type: string
		value: any
	}[]
}

enum UserRole {
	Host = 1,
	CoHost = 2,
	Participant = 3,
}

enum SubscribeMode {
	None = 0,
	TargetList = 1,
	All = 2,
	Panelists = 3,
	OnlyGallery = 4,
}

export class OSC {
	private readonly instance: InstanceBaseExt<ZoomConfig>
	private oscHost = ''
	private oscTXPort = 9099
	private oscRXPort = 1234
	private udpPort: any
	private updateLoop = true
	private needToPingPong = true
	private pingInterval: NodeJS.Timer | undefined
	private pingIntervalTime = 2000
	private updatePresetsLoop: NodeJS.Timer | undefined
	private zoomISOPuller: NodeJS.Timer | undefined

	constructor(instance: InstanceBaseExt<ZoomConfig>) {
		this.instance = instance
		// Connect to ZoomOSC
		this.Connect()
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
		return
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
			this.pingInterval = setInterval(() => {
				if (this.needToPingPong) {
					// Shall we leave this?
					this.instance.updateStatus(InstanceStatus.Connecting, 'checking connection')
					this.sendCommand('/zoom/ping')
				}
			}, this.pingIntervalTime)
			// start looping for presets
			this.updatePresetsLoop = setInterval(() => {
				if (this.updateLoop) {
					this.instance.updateInstance()
					this.updateLoop = false
					// Make sure initial status is reflected
					this.instance.checkFeedbacks('indexBased', 'galleryBased', 'groupBased', 'selectionMethod', 'userNameBased')
				}
			}, 2000)
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
				this.instance.log('debug', `${data.args[1].value}, user role ${data.args[6].value}`)
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
				this.instance.log('debug', 'wrong arguments in OSC feedback')
			}
			this.instance.InitVariables()
			this.instance.UpdateVariablesValues()
		}
	}

	private processData = async (data: ZoomOSCResponse) => {
		const recvMsg = data.address.toString().split('/')
		const zoomPart1 = recvMsg[1] // zoom, zoomosc
		const zoomPart2 = recvMsg[2] // user, me, pong, galleryShape etc.
		const zoomPart3 = recvMsg[3]
		let zoomId: number

		// Do a switch block to go fast through the rest of the data
		if (zoomPart1 == 'zoomosc') {
			this.instance.ZoomClientDataObj.last_response = Date.now()
			switch (zoomPart2) {
				case 'me':
				// let isMe = true
				/* falls through */
				case 'user':
					// Set for all cases the ZoomCallerId
					zoomId = parseInt(data.args[3].value)
					// Check if user exists, returns -1 if not
					if (!userExist(zoomId, this.instance.ZoomUserData)) {
						if (this.instance.ZoomUserOffline[zoomId]) {
							// The zoomID was already there so this probably is a ghost ID
							// this.instance.log('debug', 'User just went offline, do nothing')
						} else {
							await this.createZoomUser(data)
						}
						// what to do if nothing has been found?
					}

					switch (zoomPart3) {
						case 'list':
							// this.instance.log('info', 'receiving list data' + JSON.stringify(data))
							// {int targetIndex}, {str userName}, {int galleryIndex}, {int zoomID}
							// {int targetCount}
							// {int listCount}
							// {int userRole}
							// {int onlineStatus}
							// {int videoStatus}
							// {int audioStatus}
							// {int handRaised}
							await this.createZoomUser(data).then(() => (this.updateLoop = true))
							break
						case 'activeSpeaker':
							if (this.instance.ZoomClientDataObj.activeSpeaker !== data.args[1].value) {
								// this.instance.log('info', 'receiving:' + JSON.stringify(data))
								this.instance.ZoomClientDataObj.activeSpeaker = data.args[1].value
								this.instance.UpdateVariablesValues()
								this.instance.checkFeedbacks(
									FeedbackId.userNameBased,
									FeedbackId.indexBased,
									FeedbackId.galleryBased,
									FeedbackId.groupBased
								)
							}
							break
						case 'videoOn':
							if (userExist(zoomId, this.instance.ZoomUserData)) {
								// this.instance.log('info', 'receiving:' + JSON.stringify(data))
								this.instance.ZoomUserData[zoomId].videoOn = true
								this.instance.checkFeedbacks(FeedbackId.indexBased, FeedbackId.galleryBased, FeedbackId.groupBased)
							}
							break
						case 'videoOff':
							this.instance.log('info', 'receiving:' + JSON.stringify(data))
							if (userExist(zoomId, this.instance.ZoomUserData)) {
								this.instance.ZoomUserData[zoomId].videoOn = false
								this.instance.checkFeedbacks(FeedbackId.indexBased, FeedbackId.galleryBased, FeedbackId.groupBased)
							}
							break
						case 'mute':
							if (userExist(zoomId, this.instance.ZoomUserData)) {
								// this.instance.log('info', 'receiving:' + JSON.stringify(data))
								this.instance.ZoomUserData[zoomId].mute = true
								this.instance.checkFeedbacks(FeedbackId.indexBased, FeedbackId.galleryBased, FeedbackId.groupBased)
							}
							break
						case 'unMute':
							if (userExist(zoomId, this.instance.ZoomUserData)) {
								// this.instance.log('info', 'receiving:' + JSON.stringify(data))
								this.instance.ZoomUserData[zoomId].mute = false
								this.instance.checkFeedbacks(FeedbackId.indexBased, FeedbackId.galleryBased, FeedbackId.groupBased)
							}
							break
						case 'handRaised':
							if (userExist(zoomId, this.instance.ZoomUserData)) {
								// this.instance.log('info', 'receiving:' + JSON.stringify(data))
								this.instance.ZoomUserData[zoomId].handRaised = true
								this.instance.checkFeedbacks(FeedbackId.indexBased, FeedbackId.galleryBased, FeedbackId.groupBased)
							}
							break
						case 'handLowered':
							if (userExist(zoomId, this.instance.ZoomUserData)) {
								// this.instance.log('info', 'receiving:' + JSON.stringify(data))
								this.instance.ZoomUserData[zoomId].handRaised = false
								this.instance.checkFeedbacks(FeedbackId.indexBased, FeedbackId.galleryBased, FeedbackId.groupBased)
							}
							break
						case 'online':
							// this.instance.log('info', 'receiving:' + JSON.stringify(data))
							await this.createZoomUser(data).then(() => (this.updateLoop = true))
							break
						case 'offline': {
							// this.instance.log('info', 'receiving:' + JSON.stringify(data))
							this.instance.ZoomUserOffline[zoomId] = this.instance.ZoomUserData[zoomId]

							const hostGroupIndex = this.instance.ZoomGroupData[0].users.findIndex(
								(id) => id !== null && id.zoomID === zoomId
							)
							if (hostGroupIndex > -1) {
								this.instance.ZoomGroupData[0].users.splice(hostGroupIndex, 1)
							}
							delete this.instance.ZoomUserData[zoomId]
							const index = this.instance.ZoomVariableLink.findIndex((id: { zoomId: number }) => id.zoomId === zoomId)
							this.instance.log('debug', 'Removed:' + JSON.stringify(this.instance.ZoomVariableLink.splice(index, 1)))
							this.updateLoop = true
							break
						}
						case 'userNameChanged': {
							// this.instance.log('info', 'receiving:' + JSON.stringify(data))
							if (userExist(zoomId, this.instance.ZoomUserData)) {
								this.instance.ZoomUserData[zoomId].userName = data.args[1].value
								const findIndex = this.instance.ZoomVariableLink.findIndex(
									(id: { zoomId: number }) => id.zoomId === zoomId
								)
								this.instance.ZoomVariableLink[findIndex].userName = data.args[1].value
								this.instance.ZoomGroupData.forEach((group: ZoomGroupDataInterface) => {
									group.users.forEach((user) => {
										if (user.zoomID === zoomId) {
											user.userName = data.args[1].value
											return
										}
									})
								})

								this.instance.UpdateVariablesValues()
							}
							break
						}
						case 'chat':
							// this.instance.log('info', 'receiving:' + JSON.stringify(data))
							break
						case 'audioStatus':
							// this.instance.log('info', 'receiving:' + JSON.stringify(data))
							break
						case 'roleChanged':
							// this.instance.log('debug', 'receiving:' + JSON.stringify(data))
							if (userExist(zoomId, this.instance.ZoomUserData)) {
								this.instance.ZoomUserData[zoomId].userRole = data.args[4].value
							} else {
								return
							}

							if (data.args[4].value === UserRole.Participant) {
								const index = this.instance.ZoomGroupData[0].users.findIndex(
									(id) => id !== null && id.zoomID === zoomId
								)
								if (index > -1) {
									this.instance.ZoomGroupData[0].users.splice(index, 1)
									this.instance.checkFeedbacks(FeedbackId.groupBased)
									this.updateLoop = true
								}
							} else if (data.args[4].value === UserRole.Host || data.args[4].value === UserRole.CoHost) {
								const index = this.instance.ZoomGroupData[0].users.findIndex(
									(id) => id !== null && id.zoomID === zoomId
								)
								if (index === -1) {
									this.instance.ZoomGroupData[0].users.push({
										zoomID: zoomId,
										userName: data.args[1].value,
									})
									this.instance.log('debug', `added host: ${data.args[1].value}`)
									this.instance.checkFeedbacks(FeedbackId.groupBased)
								}
								this.updateLoop = true
							}
							this.instance.UpdateVariablesValues()
							break
						case 'stoppedSpeaking':
							// this.instance.log('info','receiving:' + data)
							// create feedback for this?
							break
						case 'isSpeaking':
							this.instance.ZoomClientDataObj.isSpeaking = data.args[1].value
							this.instance.UpdateVariablesValues()
							break
						default:
							this.instance.log('info', 'No Case provided for:' + data.address)
							this.instance.log('info', 'Arguments' + JSON.stringify(data.args))
					}
					break

				case 'galleryShape':
					// {int rows} {int cols} only for mac, skip this
					break

				case 'galleryOrder':
					// this.instance.log('debug', 'receiving:' + JSON.stringify(data))
					this.instance.ZoomClientDataObj.galleryOrder.length = 0
					data.args.forEach((order: { type: string; value: number }) => {
						this.instance.ZoomClientDataObj.galleryOrder.push(order.value)
					})
					this.instance.InitVariables()
					this.instance.UpdateVariablesValues()
					this.instance.checkFeedbacks(FeedbackId.indexBased, FeedbackId.galleryBased, FeedbackId.groupBased)
					break

				case 'galleryCount':
					this.instance.ZoomClientDataObj.galleryCount = data.args[0].value
					this.instance.UpdateVariablesValues()
					break

				case 'pong': {
					// // {str zoomOSCversion}
					// // {int subscribeMode}
					// // {int galTrackMode}
					// // {int callStatus 0 or 1}
					// // {int number of targets}
					// // {int number of users in call}
					// // {int isPro (1=true, 0-false)}
					const versionInfo = data.args[1].value as string
					if (data.args[7].value === 1) this.instance.updateStatus(InstanceStatus.Ok)
					else if (data.args[7].value === 0 || data.args[1].value.includes('lite'))
						this.instance.updateStatus(InstanceStatus.UnknownError, 'LIMITED, UNLICENSED')
					this.instance.log('debug', `${versionInfo} ${data.args[7].value === 1 ? 'Pro' : 'Lite or Essentials'}`)
					this.instance.ZoomClientDataObj.zoomOSCVersion = versionInfo
					switch (versionInfo.substring(0, 4)) {
						case 'ZISO':
							this.zoomISOPuller = setInterval(
								() => {
									if (this.instance.config.pulling !== 0) {
										this.sendISOPullingCommands()
									}
								},
								this.instance.config.pulling < 1000 ? 5000 : this.instance.config.pulling
							)
							this.instance.config.version = ZoomVersion.ZoomISO
							this.instance.saveConfig(this.instance.config)
							break
						case 'ZOSC':
							if (this.zoomISOPuller) clearInterval(this.zoomISOPuller)
							this.instance.config.version = ZoomVersion.ZoomOSC
							this.instance.saveConfig(this.instance.config)
							break
						default:
							// Default to ZoomOSC no pulling of data
							this.instance.log('info', `Wrong version status:${this.instance.ZoomClientDataObj.zoomOSCVersion}`)
							break
					}
					// this.instance.saveConfig(this.instance.config)
					this.instance.ZoomClientDataObj.subscribeMode = data.args[2].value
					this.instance.ZoomClientDataObj.callStatus = data.args[4].value
					// if (Object.keys(this.instance.ZoomUserData).length !== data.args[6].value)
					// 	this.instance.log('info', `User data doesnt match with list info`)

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
				}
				case 'meetingStatus':
					this.instance.log('info', 'receiving:' + JSON.stringify(data))
					this.instance.ZoomClientDataObj.callStatus = data.args[0].value
					// Meeting status ended
					if (data.args[0].value === 0) {
						this.instance.ZoomClientDataObj.selectedCallers.length = 0
						this.instance.ZoomVariableLink.length = 0
						this.instance.ZoomGroupData = []
						for (const key of Object.keys(this.instance.ZoomUserData)) {
							if (parseInt(key) > this.instance.ZoomClientDataObj.numberOfGroups) {
								delete this.instance.ZoomUserData[parseInt(key)]
							}
						}
						this.instance.UpdateVariablesValues()
					}
					this.needToPingPong = true
					break

				case 'listCleared':
					this.instance.ZoomClientDataObj.selectedCallers.length = 0
					this.instance.ZoomVariableLink.length = 0
					for (const key of Object.keys(this.instance.ZoomUserData)) {
						if (parseInt(key) > this.instance.ZoomClientDataObj.numberOfGroups) {
							delete this.instance.ZoomUserData[parseInt(key)]
						}
					}
					this.instance.InitVariables()
					this.instance.UpdateVariablesValues()
					break

				// ISO data
				case 'engineState':
					this.instance.ZoomClientDataObj.engineState = data.args[0].value
					this.instance.UpdateVariablesValues()
					this.instance.checkFeedbacks('engineState')
					break
				case 'audioLevels':
					// this.instance.log('info', 'audioLevels' + data.address + JSON.stringify(data.args))
					this.instance.ZoomAudioLevelData[parseInt(data.args[0].value)] = {
						channel: parseInt(data.args[0].value),
						level: parseInt(data.args[1].value),
					}
					this.instance.InitVariables()
					this.instance.UpdateVariablesValues()
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
					this.instance.InitVariables()
					this.instance.UpdateVariablesValues()
					break
				case 'outputRouting': {
					const outputNumber = parseInt(data.args[1].value)
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
					this.instance.InitVariables()
					this.instance.UpdateVariablesValues()
					break
				}
				default:
					this.instance.log('info', 'No Case provided for:' + data.address)
					this.instance.log('info', 'Arguments' + JSON.stringify(data.args))
			}
		}
	}

	/**
	 * @param command function and any params
	 * @description Check OSC connection status and format command to send to Zoom
	 */
	public readonly sendCommand = (path: string, args?: OSCSomeArguments): void => {
		// this.instance.log('debug', `sending ${JSON.stringify(path)} ${args ? JSON.stringify(args) : ''}`)
		this.udpPort.send(
			{
				address: path,
				args: args ? args : [],
			},
			this.oscHost,
			this.oscTXPort
		)
	}

	public readonly sendISOPullingCommands = (): void => {
		this.sendCommand('/zoom/getEngineState', [])
		this.sendCommand('/zoom/getAudioLevels', [])
		this.sendCommand('/zoom/getOutputRouting', [])
		this.sendCommand('/zoom/getAudioRouting', [])
		return
	}

	// /**
	//  * @description Check for config changes and start new connections/polling if needed
	//  */
	// public readonly update = (): void => {
	// 	const hostCheck = this.instance.config.host !== this.oscHost || this.instance.config.tx_port !== this.oscTXPort
	// 	// if (this.instance.ZoomClientDataObj.subscribeMode !== this.instance.config.subscribeMode) {
	// 	// 	this.instance.ZoomClientDataObj.subscribeMode = this.instance.config.subscribeMode
	// 	// 	// this.sendCommand('/zoom/subscribe', { type: 'i', value: this.instance.ZoomClientDataObj.subscribeMode })
	// 	// }
	// 	if (hostCheck) {
	// 		this.oscHost = this.instance.config.host
	// 		this.oscRXPort = this.instance.config.rx_port
	// 		this.oscTXPort = this.instance.config.tx_port
	// 		this.instance.config = this.instance.config
	// 		this.Connect()
	// 	}
	// }
}
