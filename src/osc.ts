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

export class OSC {
	private readonly instance: ZoomInstance
	private oscHost: string = ''
	private oscTXPort: number = 9099
	private oscRXPort: number = 1234
	private udpPort: any

	constructor(instance: ZoomInstance) {
		this.instance = instance

		this.instance.ZoomClientDataObj = {
			last_ping: 0,
			subscribeMode: 0,
			galleryShape: [0, 0],
			oldgalleryShape: [0, 0],
			activeSpeaker: 'None',
			zoomOSCVersion: 'Not Connected',
			galTrackMode: 0,
			callStatus: 0,
			numberOfTargets: 0,
			numberOfUsersInCall: 0,
			listIndexOffset: 0,
			numberOfSelectedUsers: 0,
		}
		this.instance.ZoomUserData = []

		// Connect to ZoomOSC
		this.Connect()
			.then(() => {
				this.instance.status(this.instance.STATUS_WARNING, 'Listening')
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
		if (this.udpPort) this.udpPort.Close()
		if (this.udpPort) this.udpPort.destroy()
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
				// this.variables = new Variables(this)
				this.instance.log('debug', `Listening to ZoomOSC on port: ${this.oscRXPort}`)
				// Subscribe to ZoomOSC
				this.sendCommand('/zoom/subscribe', { type: 'i', value: this.instance.config.subscribeMode })
				this.sendCommand('/zoom/ping')
				// Send this to fetch initial data
				this.sendCommand('/zoom/list')
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
	private createZoomUser = (data: ZoomOSCResponse) => {
		let p = new Promise((resolve) => {
			let zoomId = parseInt(data.args[3].value)
			if (data.args.length == 4) {
				this.instance.ZoomUserData[zoomId] = {
					zoomId,
					targetIndex: data.args[0].value,
					userName: data.args[1].value,
					galleryIndex: data.args[2].value,
				}
			} else {
				this.instance.ZoomUserData[zoomId] = {
					zoomId,
					targetIndex: data.args[0].value,
					userName: data.args[1].value,
					galleryIndex: data.args[2].value,
					videoOn: data.args[8].value,
					mute: data.args[9].value,
					handRaised: data.args[10].value,
				}
			}
			resolve('created')
		})
		return p
	}

	private processData = (data: ZoomOSCResponse) => {
		// console.log('received',data)
		let recvMsg = data.address.toString().split('/')
		let zoomPart1 = recvMsg[1] // zoom, zoomosc
		let zoomPart2 = recvMsg[2] // user, me, pong, galleryShape etc.
		let zoomPart3 = recvMsg[3]
		let zoomId

		// Do a switch block to go fast through the rest of the data
		if (zoomPart1 == 'zoomosc') {
			this.instance.status(this.instance.STATUS_OK)
			switch (zoomPart2) {
				case 'me':
				// let isMe = true
				/* falls through */
				case 'user':
					// Set for all cases
					zoomId = parseInt(data.args[3].value)

					switch (zoomPart3) {
						case 'list':
							// {int targetIndex}, {str userName}, {int galleryIndex}, {int zoomID}
							// {int targetCount}
							// {int listCount}
							// {int userRole}
							// {int onlineStatus}
							// {in videoStatus}
							// {int audioStatus}
							// {int handRaised}

							// Check if user exists
							if (this.instance.ZoomUserData[zoomId]) {
								this.instance.ZoomUserData[zoomId].userName = data.args[1].value
								this.instance.ZoomUserData[zoomId].targetIndex = data.args[0].value
								this.instance.ZoomUserData[zoomId].galleryIndex = data.args[2].value
								this.instance.ZoomUserData[zoomId].videoOn = data.args[8].value
								this.instance.ZoomUserData[zoomId].mute = data.args[9].value
								this.instance.ZoomUserData[zoomId].handRaised = data.args[10].value
							} else {
								this.createZoomUser(data)
							}
							// Update all actions and presets
							console.log('updating actions')

							this.instance.updateInstance()
							break
						case 'activeSpeaker':
							console.log('receiving', data)
							this.instance.ZoomClientDataObj.activeSpeaker = data.args[1].value
							this.instance.variables?.updateVariables()
							break
						case 'videoOn':
							console.log('receiving', data)
							if (this.instance.ZoomUserData[zoomId]) {
								this.instance.ZoomUserData[zoomId].videoOn = true
								this.instance.checkFeedbacks('camera')
							} else {
								this.createZoomUser(data)
							}
							break
						case 'videoOff':
							console.log('receiving', data)
							if (this.instance.ZoomUserData[zoomId]) {
								this.instance.ZoomUserData[zoomId].videoOn = false
								this.instance.checkFeedbacks('camera')
							} else {
								this.createZoomUser(data)
							}
							break
						case 'mute':
							console.log('receiving', data)
							if (this.instance.ZoomUserData[zoomId]) {
								this.instance.ZoomUserData[zoomId].mute = true
								this.instance.checkFeedbacks('microphoneMute')
							} else {
								this.createZoomUser(data)
							}
							break
						case 'unMute':
							console.log('receiving', data)
							if (this.instance.ZoomUserData[zoomId]) {
								this.instance.ZoomUserData[zoomId].mute = false
								this.instance.checkFeedbacks('microphoneMute')
							} else {
								this.createZoomUser(data)
							}
							break
						case 'handRaised':
							console.log('receiving', data)
							if (this.instance.ZoomUserData[zoomId]) {
								this.instance.ZoomUserData[zoomId].handRaised = true
								this.instance.checkFeedbacks('handRaised')
							} else {
								this.createZoomUser(data)
							}
							break
						case 'handLowered':
							console.log('receiving', data)
							if (this.instance.ZoomUserData[zoomId]) {
								this.instance.ZoomUserData[zoomId].handRaised = false
								this.instance.checkFeedbacks('handRaised')
							} else {
								this.createZoomUser(data)
							}
							break
						case 'online':
							// New user coming online, Call list?
							console.log('receiving', data)
							this.createZoomUser(data)
							break
						case 'chat':
							console.log('receiving', data)
							if (this.instance.ZoomUserData[zoomId]) {
								// Last chat message variable?
							} else {this.createZoomUser(data)}
							break
						case 'roleChanged':
							console.log('receiving', data)
							if (this.instance.ZoomUserData[zoomId]) {
								this.instance.ZoomUserData[zoomId].userRole = data.args[5].value
							} else {this.createZoomUser(data)}
							break

						default:
							console.log('No Case provided for: ' + data.address)
							console.log('Arguments', data.args)
					}
					break

				case 'galleryShape':
					// {int rows} {int cols}
					console.log('/zoomosc/galleryShape', data.args)
					this.instance.ZoomClientDataObj.galleryShape[0] = data.args[0].value
					this.instance.ZoomClientDataObj.galleryShape[1] = data.args[1].value
					this.instance.variables?.updateVariables()
					break

				case 'galleryOrder':
					// {int item0} ... {int itemN}
					console.log('/zoomosc/galleryOrder', data.args)
					break

				case 'pong':
					// {any pingArg (zero if none sent)}
					// {str zoomOSCversion}
					// {int subscribeMode}
					// {int galTrackMode}
					// {int callStatus 0 or 1}
					// {int number of targets}
					// {int number of users in call}
					// {int isPro (1=true, 0-false)}
					this.instance.ZoomClientDataObj.last_ping = Date.now()
					this.instance.ZoomClientDataObj.zoomOSCVersion = data.args[1].value
					this.instance.ZoomClientDataObj.subscribeMode = data.args[2].value
					this.instance.ZoomClientDataObj.galTrackMode = data.args[3].value
					this.instance.ZoomClientDataObj.callStatus = data.args[4].value
					this.instance.ZoomClientDataObj.numberOfTargets = data.args[5].value
					this.instance.ZoomClientDataObj.numberOfUsersInCall = data.args[6].value
					this.instance.variables?.updateVariables()
					break

				case 'meetingStatus':
					this.instance.ZoomClientDataObj.callStatus = data.args[0].value
					this.instance.variables?.updateVariables()
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
		if (this.instance.ZoomClientDataObj.subscribeMode !== this.instance.config.subscribeMode) {
			this.instance.ZoomClientDataObj.subscribeMode = this.instance.config.subscribeMode
			// this.sendCommand('/zoom/subscribe', { type: 'i', value: this.instance.ZoomClientDataObj.subscribeMode })
		}
		if (hostCheck) {
			this.oscHost = this.instance.config.host
			this.oscRXPort = this.instance.config.rx_port
			this.oscTXPort = this.instance.config.tx_port
			this.instance.config = this.instance.config
			this.Connect()
		}
	}
}
