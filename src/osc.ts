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

	constructor(instance: ZoomInstance) {
		this.instance = instance

		this.instance.updateVariables()
		// Connect to ZoomOSC
		this.Connect()
			.then(() => {
				this.instance.status(this.instance.STATUS_WARNING, 'Listening for first command')
				console.log('ZoomOSC listener active')
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
					console.log('error', 'Error: Selected port in use.' + err.message)
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
						this.instance.checkFeedbacks('handRaised')
						this.instance.checkFeedbacks('camera')
						this.instance.checkFeedbacks('microphoneLive')
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
		// search if exist under other name first

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
				videoOn: data.args[8].value,
				mute: data.args[9].value,
				handRaised: data.args[10].value,
				users: [],
			}
		} else {
			console.log('wrong arguments in OSC feedback')
		}
		// update it all
		this.instance.ZoomClientDataObj.numberOfUsersInCall =
			Object.keys(this.instance.ZoomUserData).length - this.instance.ZoomClientDataObj.numberOfGroups
		this.instance.updateVariables()
	}

	private processData = async (data: ZoomOSCResponse) => {
		// console.log('received',data)
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
						// for (let [key, value] of Object.entries(this.instance.ZoomUserData)) {
						// 	console.log(`${key}: ${value}`);
						// }
						if (this.instance.ZoomUserOffline[zoomId]) {
							// The zoomID was already there so this probably is a ghost ID
							console.log('User just went offline, do nothing')
						} else {
							await this.createZoomUser(data)
						}
						// what to do if nothing has been found?
					}

					switch (zoomPart3) {
						case 'list':
							console.log('receiving list data', data)

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
							console.log('receiving', data)
							this.instance.ZoomClientDataObj.activeSpeaker = data.args[1].value
							this.instance.variables?.updateVariables()
							break
						case 'videoOn':
							console.log('receiving', data)
							this.instance.ZoomUserData[zoomId].videoOn = true
							this.instance.checkFeedbacks('camera')
							break
						case 'videoOff':
							console.log('receiving', data)
							this.instance.ZoomUserData[zoomId].videoOn = false
							this.instance.checkFeedbacks('camera')
							break
						case 'mute':
							console.log('receiving', data)
							this.instance.ZoomUserData[zoomId].mute = true
							this.instance.checkFeedbacks('microphoneLive')
							break
						case 'unMute':
							console.log('receiving', data)
							this.instance.ZoomUserData[zoomId].mute = false
							this.instance.checkFeedbacks('microphoneLive')
							break
						case 'handRaised':
							console.log('receiving', data)
							this.instance.ZoomUserData[zoomId].handRaised = true
							this.instance.checkFeedbacks('handRaised')
							break
						case 'handLowered':
							console.log('receiving', data)
							this.instance.ZoomUserData[zoomId].handRaised = false
							this.instance.checkFeedbacks('handRaised')
							break
						case 'online':
							console.log('receiving', data)
							this.createZoomUser(data).then(() => (this.updateLoop = true))
							break
						case 'offline':
							console.log('receiving', data)
							this.instance.ZoomUserOffline[zoomId] = this.instance.ZoomUserData[zoomId]
							delete this.instance.ZoomUserData[zoomId]
							let index = this.instance.ZoomVariableLink.findIndex((id) => id.zoomId === zoomId)
							console.log('Removed:', this.instance.ZoomVariableLink.splice(index, 1))
							this.updateLoop = true
							break
						case 'userNameChanged':
							console.log('receiving', data)
							this.instance.ZoomUserData[zoomId].userName = data.args[1].value
							this.instance.variables?.updateVariables()
							break
						case 'chat':
							console.log('receiving', data)
							break
						case 'roleChanged':
							console.log('receiving', data)
							this.instance.ZoomUserData[zoomId].userRole = data.args[4].value
							break
						case 'stoppedSpeaking':
							// console.log('receiving', data)
							// create feedback for this?
							break
						case 'isSpeaking':
							this.instance.ZoomClientDataObj.lastSpeaking = data.args[1].value
							this.instance.variables?.updateVariables()
							break

						default:
							console.log('No Case provided for: ' + data.address)
							console.log('Arguments', data.args)
					}
					break

				case 'galleryShape':
					// {int rows} {int cols} only for mac, skip this
					break

				case 'galleryOrder':
					console.log('receiving', data)
					this.instance.log('debug', `Gallery info ${JSON.stringify(data.args)}`)
					this.instance.ZoomClientDataObj.galleryOrder.length = 0
					data.args.forEach((order: { type: string; value: number }) => {
						this.instance.ZoomClientDataObj.galleryOrder.push(order.value)
					})
					this.instance.variables?.updateDefinitions()
					this.instance.variables?.updateVariables()
					break

				case 'galleryCount':
					console.log('receiving', data)
					this.instance.ZoomClientDataObj.galleryCount = data.args[0].value
					this.instance.variables?.updateVariables()
					break

				case 'pong':
					console.log('receiving', data)
					// {any pingArg (zero if none sent)}
					// {str zoomOSCversion}
					// {int subscribeMode}
					// {int galTrackMode}
					// {int callStatus 0 or 1}
					// {int number of targets}
					// {int number of users in call}
					// {int isPro (1=true, 0-false)}
					this.instance.ZoomClientDataObj.zoomOSCVersion = data.args[1].value
					this.instance.ZoomClientDataObj.subscribeMode = data.args[2].value
					this.instance.ZoomClientDataObj.callStatus = data.args[4].value
					this.instance.ZoomClientDataObj.numberOfUsersInCall = data.args[6].value
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
					console.log('received', data)
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

				default:
					console.log('No Case provided for: ' + data.address)
					console.log('Arguments', data.args)
			}
		}
	}

	/**
	 * @param command function and any params
	 * @description Check OSC connection status and format command to send to Zoom
	 */
	public readonly sendCommand = (path: string, args?: OSCSomeArguments): void => {
		// this.instance.oscSend(this.oscHost, this.oscTXPort, path, args ? args : [])
		console.log('sending', path, args ? args : '')

		this.udpPort.send(
			{
				address: path,
				args: args ? args : [],
			},
			this.oscHost,
			this.oscTXPort
		)
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
