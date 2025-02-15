import { arrayRemove, InstanceBaseExt, SubscribeMode, userExist, ZoomGroupDataInterface, ZoomVersion } from './utils.js'
import { CompanionVariableValues, InstanceStatus, OSCSomeArguments } from '@companion-module/base'
import { ZoomConfig } from './config.js'
import { FeedbackId } from './feedback.js'
import { PreviousSelectedCallersRestore, PreviousSelectedCallersSave } from './actions/action-utils.js'
import { socialStreamApi } from './socialstream.js'
import {
	updateActiveSpeakerVariable,
	updateHandRaisedCountVariable,
	updateSpotlightGroupVariables,
	updateHostGroupVariables,
	updateVideoOnCountVariable,
	updateZoomIsoEngineVariables,
	updateZoomIsoAudioLevelVariables,
	updateZoomIsoAudioRoutingVariables,
	updateZoomIsoOutputVariables,
	updateGalleryVariables,
	updateAllGroupVariables,
	updateZoomParticipantVariables,
	updateSelectedCallersVariables,
	updateZoomUserVariables,
	updateAllUserBasedVariables,
	updateIsSpeakingVariable,
	updateGalleryCountVariables,
	updateCallStatusVariables,
	updateSpotlightGroupInitalizedVariable,
	updateZoomOscVersion,
} from './variables/variable-values.js'
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

	private processData = async (data: ZoomOSCResponse) => {
		// this.instance.log('debug', '+++++++++++receiving:' + JSON.stringify(data))
		// Do a switch block to go fast through the rest of the data
		try {
			const recvMsg = data.address.toString().split('/')
			const zoomPart1 = recvMsg[1] // zoom, zoomosc
			const zoomPart2 = recvMsg[2] // user, me, pong, galleryShape etc.
			const zoomPart3 = recvMsg[3]
			let zoomId: number
			if (zoomPart1 == 'zoomosc') {
				this.instance.ZoomClientDataObj.last_response = Date.now()
				switch (zoomPart2) {
					case 'me':
					// let isMe = true
					/* falls through */
					case 'user':
						// Set for all cases the ZoomCallerId
						zoomId = parseInt(data.args[3].value)
						if (zoomPart2 === 'me') {
							this.instance.ZoomMeData = {
								zoomId: zoomId,
								userName: data.args[1].value,
							}
						}
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
							case 'spotlightOn':
								// this.instance.log('info', 'receiving spotlightOn:' + JSON.stringify(data))
								if (userExist(zoomId, this.instance.ZoomUserData)) {
									// this.instance.log('info', 'receiving:' + JSON.stringify(data))
									this.instance.ZoomUserData[zoomId].spotlighted = true
									const index = this.instance.ZoomGroupData[1].users.findIndex(
										(id) => id !== null && id.zoomID === zoomId,
									)

									if (index === -1) {
										this.instance.ZoomGroupData[1].users.push({
											zoomID: zoomId,
											userName: data.args[1].value,
										})
										// this.instance.log('debug', `added spotlight: ${data.args[1].value}`)
										// this.instance.UpdateVariablesValues()
										// for performance updating values just for spotlight instead of all variables
										const variables: CompanionVariableValues = {}
										updateSpotlightGroupVariables(this.instance, variables)
										this.instance.setVariableValues(variables)
									}

									this.instance.checkFeedbacks(
										FeedbackId.userNameBased,
										FeedbackId.userNameBasedAdvanced,
										FeedbackId.indexBased,
										FeedbackId.indexBasedAdvanced,
										FeedbackId.galleryBased,
										FeedbackId.galleryBasedAdvanced,
										FeedbackId.groupBased,
										FeedbackId.groupBasedAdvanced,
									)
								}
								break
							case 'spotlightOff':
								if (userExist(zoomId, this.instance.ZoomUserData)) {
									// this.instance.log('info', 'receiving spotlightOff:' + JSON.stringify(data))
									this.instance.ZoomUserData[zoomId].spotlighted = false
									const index = this.instance.ZoomGroupData[1].users.findIndex(
										(id) => id !== null && id.zoomID === zoomId,
									)
									if (index > -1) {
										this.instance.ZoomGroupData[1].users.splice(index, 1)
										// this.instance.UpdateVariablesValues()
										// for performance updating values just for spotlight instead of all variables
										const variables: CompanionVariableValues = {}
										updateSpotlightGroupVariables(this.instance, variables)
										this.instance.setVariableValues(variables)
									}

									this.instance.checkFeedbacks(
										FeedbackId.userNameBased,
										FeedbackId.userNameBasedAdvanced,
										FeedbackId.indexBased,
										FeedbackId.indexBasedAdvanced,
										FeedbackId.galleryBased,
										FeedbackId.galleryBasedAdvanced,
										FeedbackId.groupBased,
										FeedbackId.groupBasedAdvanced,
									)
								}
								break
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
								// this.instance.log('info', 'active speaker receiving:' + JSON.stringify(data))
								if (this.instance.ZoomClientDataObj.activeSpeaker !== data.args[1].value) {
									this.instance.ZoomClientDataObj.activeSpeaker = data.args[1].value
									this.instance.ZoomClientDataObj.activeSpeakerZoomId = data.args[3].value
									const variables: CompanionVariableValues = {}
									updateActiveSpeakerVariable(this.instance, variables)
									this.instance.setVariableValues(variables)
									// this.instance.UpdateVariablesValues()
									this.instance.checkFeedbacks(
										FeedbackId.userNameBased,
										FeedbackId.userNameBasedAdvanced,
										FeedbackId.indexBased,
										FeedbackId.indexBasedAdvanced,
										FeedbackId.galleryBased,
										FeedbackId.galleryBasedAdvanced,
										FeedbackId.groupBased,
										FeedbackId.groupBasedAdvanced,
									)
								}
								break
							case 'videoOn':
								if (userExist(zoomId, this.instance.ZoomUserData)) {
									// this.instance.log('info', 'receiving:' + JSON.stringify(data))
									this.instance.ZoomUserData[zoomId].videoOn = true
									// for performance updating values just videoOn instead of all variables
									const variables: CompanionVariableValues = {}
									updateVideoOnCountVariable(this.instance, variables)
									this.instance.setVariableValues(variables)
									this.instance.checkFeedbacks(
										FeedbackId.userNameBased,
										FeedbackId.userNameBasedAdvanced,
										FeedbackId.indexBased,
										FeedbackId.indexBasedAdvanced,
										FeedbackId.galleryBased,
										FeedbackId.galleryBasedAdvanced,
										FeedbackId.groupBased,
										FeedbackId.groupBasedAdvanced,
									)
								}
								break
							case 'videoOff':
								// this.instance.log('info', 'receiving:' + JSON.stringify(data))
								if (userExist(zoomId, this.instance.ZoomUserData)) {
									this.instance.ZoomUserData[zoomId].videoOn = false
									// this.instance.UpdateVariablesValues()
									// for performance updating values just videoOn instead of all variables
									const variables: CompanionVariableValues = {}
									updateVideoOnCountVariable(this.instance, variables)
									this.instance.setVariableValues(variables)
									this.instance.checkFeedbacks(
										FeedbackId.userNameBased,
										FeedbackId.userNameBasedAdvanced,
										FeedbackId.indexBased,
										FeedbackId.indexBasedAdvanced,
										FeedbackId.galleryBased,
										FeedbackId.galleryBasedAdvanced,
										FeedbackId.groupBased,
										FeedbackId.groupBasedAdvanced,
									)
								}
								break
							case 'mute':
								if (userExist(zoomId, this.instance.ZoomUserData)) {
									// this.instance.log('info', 'receiving:' + JSON.stringify(data))
									this.instance.ZoomUserData[zoomId].mute = true
									this.instance.checkFeedbacks(
										FeedbackId.userNameBased,
										FeedbackId.userNameBasedAdvanced,
										FeedbackId.indexBased,
										FeedbackId.indexBasedAdvanced,
										FeedbackId.galleryBased,
										FeedbackId.galleryBasedAdvanced,
										FeedbackId.groupBased,
										FeedbackId.groupBasedAdvanced,
									)
								}
								break
							case 'unMute':
								if (userExist(zoomId, this.instance.ZoomUserData)) {
									// this.instance.log('info', 'receiving:' + JSON.stringify(data))
									this.instance.ZoomUserData[zoomId].mute = false
									this.instance.checkFeedbacks(
										FeedbackId.userNameBased,
										FeedbackId.userNameBasedAdvanced,
										FeedbackId.indexBased,
										FeedbackId.indexBasedAdvanced,
										FeedbackId.galleryBased,
										FeedbackId.galleryBasedAdvanced,
										FeedbackId.groupBased,
										FeedbackId.groupBasedAdvanced,
									)
								}
								break
							case 'handRaised':
								if (userExist(zoomId, this.instance.ZoomUserData)) {
									// this.instance.log('info', 'receiving:' + JSON.stringify(data))
									this.instance.ZoomUserData[zoomId].handRaised = true
									const variables: CompanionVariableValues = {}
									updateHandRaisedCountVariable(this.instance, variables)
									this.instance.setVariableValues(variables)
									this.instance.checkFeedbacks(
										FeedbackId.userNameBased,
										FeedbackId.userNameBasedAdvanced,
										FeedbackId.indexBased,
										FeedbackId.indexBasedAdvanced,
										FeedbackId.galleryBased,
										FeedbackId.galleryBasedAdvanced,
										FeedbackId.groupBased,
										FeedbackId.groupBasedAdvanced,
									)
								}
								break
							case 'handLowered':
								if (userExist(zoomId, this.instance.ZoomUserData)) {
									// this.instance.log('info', 'receiving:' + JSON.stringify(data))
									this.instance.ZoomUserData[zoomId].handRaised = false
									const variables: CompanionVariableValues = {}
									updateHandRaisedCountVariable(this.instance, variables)
									this.instance.setVariableValues(variables)
									this.instance.checkFeedbacks(
										FeedbackId.userNameBased,
										FeedbackId.userNameBasedAdvanced,
										FeedbackId.indexBased,
										FeedbackId.indexBasedAdvanced,
										FeedbackId.galleryBased,
										FeedbackId.galleryBasedAdvanced,
										FeedbackId.groupBased,
										FeedbackId.groupBasedAdvanced,
									)
								}
								break
							case 'online':
								// this.instance.log('info', 'receiving:' + JSON.stringify(data))
								await this.createZoomUser(data).then(() => (this.updateLoop = true))
								break
							case 'offline': {
								// this.instance.log('info', '*** offline *** receiving:' + JSON.stringify(data))
								if (userExist(zoomId, this.instance.ZoomUserData)) {
									this.instance.ZoomUserOffline[zoomId] = this.instance.ZoomUserData[zoomId]

									this.instance.ZoomGroupData.forEach((group: ZoomGroupDataInterface) => {
										const groupIndex = group.users.findIndex((id) => id !== null && id.zoomID === zoomId)
										if (groupIndex > -1) {
											group.users.splice(groupIndex, 1)
										}
									})

									this.instance.ZoomClientDataObj.selectedCallers = arrayRemove(
										this.instance.ZoomClientDataObj.selectedCallers,
										zoomId,
									)

									delete this.instance.ZoomUserData[zoomId]
									const index = this.instance.ZoomVariableLink.findIndex(
										(id: { zoomId: number }) => id.zoomId === zoomId,
									)
									if (index > -1) {
										this.instance.log(
											'debug',
											`Removed ${JSON.stringify(this.instance.ZoomVariableLink.splice(index, 1))}`,
										)
									}
									// this.instance.UpdateVariablesValues()
									const variables: CompanionVariableValues = {}
									updateAllUserBasedVariables(this.instance, variables)
									this.instance.setVariableValues(variables)
									this.instance.checkFeedbacks(
										FeedbackId.userNameBased,
										FeedbackId.userNameBasedAdvanced,
										FeedbackId.indexBased,
										FeedbackId.indexBasedAdvanced,
										FeedbackId.galleryBased,
										FeedbackId.galleryBasedAdvanced,
										FeedbackId.groupBased,
										FeedbackId.groupBasedAdvanced,
									)

									this.updateLoop = true
								}
								break
							}
							case 'userNameChanged': {
								// this.instance.log('info', 'receiving:' + JSON.stringify(data))
								if (userExist(zoomId, this.instance.ZoomUserData)) {
									this.instance.ZoomUserData[zoomId].userName = data.args[1].value
									const findIndex = this.instance.ZoomVariableLink.findIndex(
										(id: { zoomId: number }) => id.zoomId === zoomId,
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

									const variables: CompanionVariableValues = {}
									updateAllGroupVariables(this.instance, variables)
									updateZoomParticipantVariables(this.instance, variables)
									updateSelectedCallersVariables(this.instance, variables)
									updateGalleryVariables(this.instance, variables)
									updateZoomUserVariables(this.instance, variables)
									this.instance.setVariableValues(variables)
									// this.instance.UpdateVariablesValues()
								}
								break
							}
							case 'chat':
								// this.instance.log('info', `chat receiving: ${JSON.stringify(data)}`)
								// Chat Message Target:
								// 0 None
								// 1 All
								// 2 All Panelist
								// 3 Individual Panelist
								// 4 Individual
								// 5 Waiting Room
								if (
									this.instance.config.enableSocialStream &&
									this.instance.config.socialStreamId.length > 0 &&
									data.args.length >= 5 &&
									this.instance.config.socialStreamChatTypeToSend.includes(data.args[6].value)
								) {
									await socialStreamApi.postMessage(data.args[1].value, data.args[4].value, this.instance)
								}
								break
							case 'askedQuestion': {
								if (
									this.instance.config.enableSocialStream &&
									this.instance.config.socialStreamId.length > 0 &&
									data.args.length >= 5
								) {
									await socialStreamApi.postMessage(
										data.args[1].value,
										`${this.instance.config.socialStreamQuestionPrefix}${data.args[4].value}`,
										this.instance,
									)
								}
								break
							}
							case 'audioStatus':
								// this.instance.log('info', 'receiving:' + JSON.stringify(data))
								break
							case 'roleChanged': {
								// this.instance.log('debug', 'receiving:' + JSON.stringify(data))
								if (userExist(zoomId, this.instance.ZoomUserData)) {
									this.instance.ZoomUserData[zoomId].userRole = data.args[4].value
								} else {
									return
								}

								if (data.args[4].value === UserRole.Participant) {
									const index = this.instance.ZoomGroupData[0].users.findIndex(
										(id) => id !== null && id.zoomID === zoomId,
									)
									if (index > -1) {
										this.instance.ZoomGroupData[0].users.splice(index, 1)
										const variables: CompanionVariableValues = {}
										updateHostGroupVariables(this.instance, variables)
										this.instance.setVariableValues(variables)
										this.instance.checkFeedbacks(FeedbackId.groupBased, FeedbackId.groupBasedAdvanced)
										this.updateLoop = true
									}
								} else if (data.args[4].value === UserRole.Host || data.args[4].value === UserRole.CoHost) {
									const index = this.instance.ZoomGroupData[0].users.findIndex(
										(id) => id !== null && id.zoomID === zoomId,
									)
									if (index === -1) {
										this.instance.ZoomGroupData[0].users.push({
											zoomID: zoomId,
											userName: data.args[1].value,
										})
										this.instance.log('debug', `added host: ${data.args[1].value}`)
										const variables: CompanionVariableValues = {}
										updateHostGroupVariables(this.instance, variables)
										this.instance.setVariableValues(variables)
										this.instance.checkFeedbacks(FeedbackId.groupBased, FeedbackId.groupBasedAdvanced)
										this.updateLoop = true
									}
								}
								break
							}
							case 'stoppedSpeaking':
								// this.instance.log('info','receiving:' + data)
								// create feedback for this?
								break
							case 'isSpeaking': {
								this.instance.ZoomClientDataObj.isSpeaking = data.args[1].value
								const variables: CompanionVariableValues = {}
								updateIsSpeakingVariable(this.instance, variables)
								this.instance.setVariableValues(variables)
								// this.instance.UpdateVariablesValues()
								break
							}
							case 'shareStatus': {
								const shareType = data.args[4].value
								const variables: CompanionVariableValues = {}
								if (shareType === 'videoShareStarted') {
									variables['videoShareStatus'] = 'On'
								} else {
									// for now we only care about the share screen and not the audio only share
									// else if (shareType === 'videoShareStopped') {
									variables['videoShareStatus'] = 'Off'
								}
								this.instance.setVariableValues(variables)
								break
							}
							default:
								// this.instance.log(
								// 	'debug',
								// 	`No Case provided for: ${data.address} - Arguments ${JSON.stringify(data.args)}`
								// )
								break
						}
						break

					case 'galleryShape':
						// {int rows} {int cols} only for mac, skip this
						break

					case 'galleryOrder': {
						// this.instance.log('debug', 'receiving:' + JSON.stringify(data))
						// got empty gallery order array. Skip this
						if (data.args.length === 0) {
							return
						}

						this.instance.ZoomClientDataObj.galleryOrder = data.args.map(
							(order: { type: string; value: number }) => order.value,
						)

						this.instance.InitVariables()

						const variables: CompanionVariableValues = {}
						updateGalleryVariables(this.instance, variables)
						this.instance.setVariableValues(variables)

						this.instance.checkFeedbacks(FeedbackId.galleryBased, FeedbackId.galleryBasedAdvanced)
						break
					}
					case 'galleryCount': {
						this.instance.ZoomClientDataObj.galleryCount = data.args[0].value
						const variables: CompanionVariableValues = {}
						updateGalleryCountVariables(this.instance, variables)
						this.instance.setVariableValues(variables)
						// this.instance.UpdateVariablesValues()
						break
					}
					case 'pong': {
						this.instance.log('debug', 'receiving pong')
						// this.instance.log('debug', `receiving pong ${JSON.stringify(data)}`)
						// // {str zoomOSCversion}
						// // {int subscribeMode}
						// // {int galTrackMode}
						// // {int callStatus 0 or 1}
						// // {int number of targets}
						// // {int number of users in call}
						// // {int isPro (1=true, 0-false)}
						const variables: CompanionVariableValues = {}
						const versionInfo = data.args[1].value as string
						if (data.args[7].value === 1) {
							this.instance.updateStatus(InstanceStatus.Ok)
						} else if (data.args[7].value === 0 || data.args[1].value.includes('lite')) {
							this.instance.updateStatus(InstanceStatus.Ok)
							// this.instance.updateStatus(InstanceStatus.UnknownError, 'LIMITED, UNLICENSED')
						}

						this.instance.log('debug', `${versionInfo} ${data.args[7].value === 1 ? 'Pro' : 'Lite or Essentials'}`)
						this.instance.ZoomClientDataObj.zoomOSCVersion = versionInfo
						this.instance.ZoomClientDataObj.subscribeMode = data.args[2].value
						this.instance.ZoomClientDataObj.callStatus = data.args[4].value
						updateCallStatusVariables(this.instance, variables)
						updateZoomOscVersion(this.instance, variables)
						this.instance.setVariableValues(variables)

						switch (versionInfo.substring(0, 4)) {
							case 'ZISO': {
								// this.instance.log('debug', `Meeting Status: ${data.args[4].value}. Timer: ${this.zoomISOPuller}`)
								if (!this.zoomISOPuller && data.args[4].value === 1) {
									this.createZoomIsoPullerTimer()
								}

								if (this.instance.config.version !== (ZoomVersion.ZoomISO as number)) {
									this.instance.config.version = ZoomVersion.ZoomISO
									this.instance.saveConfig(this.instance.config)
								}
								break
							}
							case 'ZOSC':
								if (this.zoomISOPuller) {
									this.destroyZoomIsoPullerTimer()
								}
								if (this.instance.config.version !== (ZoomVersion.ZoomOSC as number)) {
									this.instance.config.version = ZoomVersion.ZoomOSC
									this.instance.saveConfig(this.instance.config)
								}
								break
							default:
								// Default to ZoomOSC no pulling of data
								this.instance.log('info', `Wrong version status:${this.instance.ZoomClientDataObj.zoomOSCVersion}`)
								break
						}
						// 	this.instance.log('info', `User data doesnt match with list info`)

						this.needToPingPong = false
						if (this.pingInterval) {
							this.destroyPingTimer()
							this.pingIntervalTime = 60000
							// if in call then start ping timer else destroy all timers
							if (data.args[4].value === 1) {
								this.pingInterval = setInterval(() => {
									// When 60 seconds no response start pinging again
									if (Date.now() - this.instance.ZoomClientDataObj.last_response > 60000) {
										this.sendCommand('/zoom/ping')
									}
								}, this.pingIntervalTime)
							} else {
								this.destroyTimers()
							}
						}

						// Subscribe to ZoomOSC
						this.sendCommand('/zoom/subscribe', [{ type: 'i', value: SubscribeMode.All }])
						this.sendCommand('/zoom/galTrackMode', [{ type: 'i', value: 1 }])
						this.sendCommand('/zoom/getSpotOrder', [])
						// Start a loop to process incoming data in the backend
						this.updateLoop = true
						break
					}
					case 'spotOrder': {
						// this.instance.log('info', 'receiving spotOrder:' + JSON.stringify(data))
						this.instance.ZoomGroupData[1].users.length = 0
						let updatedData = false
						data.args.forEach((order: { type: string; value: number }) => {
							if (userExist(order.value, this.instance.ZoomUserData)) {
								this.instance.ZoomUserData[order.value].spotlighted = true

								const findIndex = this.instance.ZoomVariableLink.findIndex(
									(id: { zoomId: number }) => id.zoomId === order.value,
								)
								this.instance.ZoomGroupData[1].users.push({
									userName: this.instance.ZoomVariableLink[findIndex].userName,
									zoomID: order.value,
								})

								updatedData = true
							}
						})

						if (updatedData || !this.spotlightGroupTrackingInitalized) {
							this.spotlightGroupTrackingInitalized = true
							this.instance.InitVariables()
							const variables: CompanionVariableValues = {}
							updateSpotlightGroupInitalizedVariable(variables)
							updateSpotlightGroupVariables(this.instance, variables)
							this.instance.setVariableValues(variables)
							// this.instance.UpdateVariablesValues()
							this.instance.checkFeedbacks(
								FeedbackId.indexBased,
								FeedbackId.indexBasedAdvanced,
								FeedbackId.galleryBased,
								FeedbackId.galleryBasedAdvanced,
								FeedbackId.groupBased,
								FeedbackId.groupBasedAdvanced,
							)

							this.instance.updateDefinitionsForActionsFeedbacksAndPresets()
						}
						break
					}
					case 'meetingStatusChanged':
					case 'meetingStatus': {
						this.instance.log('info', `meetingStatus receiving: ${JSON.stringify(data.args[0].value)}`)
						this.instance.ZoomClientDataObj.callStatus = data.args[0].value
						const variables: CompanionVariableValues = {}

						// Meeting status ended
						// 0 = Meeting Status Idle
						// 7 = Meeting Status Ended
						if (data.args[0].value === 0 || data.args[0].value === 7) {
							this.destroyTimers()
							this.instance.ZoomUserData = {}
							this.instance.ZoomClientDataObj = {
								last_response: this.instance.ZoomClientDataObj.last_response,
								selectedCallers: [],
								PreviousSelectedCallers: [],
								selectedOutputs: [],
								selectedAudioOutputs: [],
								subscribeMode: this.instance.ZoomClientDataObj.subscribeMode,
								activeSpeaker: 'None',
								activeSpeakerZoomId: -1,
								isSpeaking: 'None',
								zoomOSCVersion: this.instance.ZoomClientDataObj.zoomOSCVersion,
								callStatus: this.instance.ZoomClientDataObj.callStatus,
								galleryCount: 0,
								galleryOrder: [],
								numberOfGroups: this.instance.ZoomClientDataObj.numberOfGroups,
								engineState: this.instance.ZoomClientDataObj.engineState,
								capturePermissionGranted: this.instance.ZoomClientDataObj.capturePermissionGranted,
							}
							this.instance.ZoomVariableLink.length = 0

							this.instance.ZoomGroupData = Array.from(
								{ length: this.instance.ZoomClientDataObj.numberOfGroups + 2 },
								(_, index) => ({
									groupName: index === 0 ? 'Hosts' : index === 1 ? 'Spotlights' : `Group ${index}`,
									users: [],
								}),
							)

							this.instance.ZoomUserData = {}
							this.instance.InitVariables()
							updateCallStatusVariables(this.instance, variables)
							updateAllUserBasedVariables(this.instance, variables)
							this.instance.setVariableValues(variables)
							// this.instance.UpdateVariablesValues()
							this.instance.checkFeedbacks()
						} else {
							// 3 = In Meeting
							if (this.instance.ZoomClientDataObj.callStatus === 3) {
								this.needToPingPong = true
								this.createPingTimer()
								this.createUpdatePresetsTimer()
								this.createZoomIsoPullerTimer()
							}
							updateCallStatusVariables(this.instance, variables)
							this.instance.setVariableValues(variables)
						}
						break
					}
					case 'listCleared': {
						this.instance.log('debug', 'listCleared')
						PreviousSelectedCallersSave(this.instance)
						this.instance.ZoomClientDataObj.selectedCallers.length = 0
						this.instance.ZoomVariableLink.length = 0
						this.instance.ZoomUserData = {}

						this.instance.InitVariables()
						const variables: CompanionVariableValues = {}
						updateAllUserBasedVariables(this.instance, variables)
						this.instance.setVariableValues(variables)
						// this.instance.UpdateVariablesValues()
						PreviousSelectedCallersRestore(this.instance)
						break
					}
					// ISO data
					case 'engineState': {
						// this.instance.log('info', `engine state receiving: ${JSON.stringify(data)}`)
						this.instance.ZoomClientDataObj.engineState = data.args[0].value
						const variables: CompanionVariableValues = {}
						updateZoomIsoEngineVariables(this.instance, variables)
						this.instance.setVariableValues(variables)
						this.instance.checkFeedbacks(FeedbackId.engineState)
						break
					}
					case 'audioLevels': {
						// this.instance.log('info', 'audioLevels' + data.address + JSON.stringify(data.args))
						this.instance.ZoomAudioLevelData[parseInt(data.args[0].value)] = {
							channel: parseInt(data.args[0].value),
							level: parseInt(data.args[1].value),
						}
						this.instance.InitVariables()
						const variables: CompanionVariableValues = {}
						updateZoomIsoAudioLevelVariables(this.instance, variables)
						this.instance.setVariableValues(variables)
						// this.instance.UpdateVariablesValues()
						break
					}
					case 'audioRouting': {
						// this.instance.log('info', `AudioRouting: ${JSON.stringify(data.args)}`)
						this.instance.ZoomAudioRoutingData[parseInt(data.args[2].value)] = {
							audio_device: data.args[0].value,
							num_channels: parseInt(data.args[1].value),
							channel: parseInt(data.args[2].value),
							mode: data.args[3].value,
							gain_reduction: parseInt(data.args[4].value),
							selection: data.args[5].value,
						}
						this.instance.InitVariables()
						const variables: CompanionVariableValues = {}
						updateZoomIsoAudioRoutingVariables(this.instance, variables)
						this.instance.setVariableValues(variables)
						// this.instance.UpdateVariablesValues()
						break
					}
					case 'outputRouting': {
						// this.instance.log('debug', `OutputRouting: ${JSON.stringify(data.args)}`)
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
						const variables: CompanionVariableValues = {}
						updateZoomIsoOutputVariables(this.instance, variables)
						this.instance.setVariableValues(variables)
						this.instance.checkFeedbacks(FeedbackId.output)
						break
					}
					default:
						// this.instance.log('info', 'No Case provided for:' + data.address)
						// this.instance.log('info', 'Arguments' + JSON.stringify(data.args))
						break
				}
			}
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
			this.udpPort.send(
				{
					address: path,
					args: args ? args : [],
				},
				this.oscHost,
				this.oscTXPort,
			)
		} catch (error) {
			this.instance.log(
				'error',
				`sendCommand error for path: ${path} and args: ${JSON.stringify(args)}. Error: ${JSON.stringify(error)}`,
			)
		}
	}

	public readonly sendISOPullingCommands = (): void => {
		// this.instance.log('debug', 'sendISOPullingCommands')
		this.sendCommand('/zoom/getEngineState', [])
		this.sendCommand('/zoom/getAudioLevels', [])
		this.sendCommand('/zoom/getOutputRouting', [])
		this.sendCommand('/zoom/getAudioRouting', [])
		return
	}
}
