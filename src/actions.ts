import {
	CompanionActionDefinition,
	CompanionActionDefinitions,
	CompanionActionEvent,
	InputValue,
	SomeCompanionActionInputField,
} from '@companion-module/base'
import { ZoomConfig } from './config'
import { FeedbackId } from './feedback'
import { arrayAddRemove, arrayRemove, InstanceBaseExt, options, ZoomGroupDataInterface } from './utils'

const select = { single: true, multi: false }

export enum ActionId {
	setAudioGainReduction = 'set_AudioGain_Reduction',
	setOutputSelection = 'set_Output_Selection',
	setAudioSelection = 'set_Audio_Selection',
	setOutputEmbeddedAudio = 'set_Output_Embedded_Audio',
	setVideoLossMode = 'set_VideoLoss_Mode',
	setOutputName = 'set_Output_Name',
	deleteOutput = 'delete_Output',
	outputISO = 'output_ISO',
	audioISO = 'audio_ISO',
	startISOEngine = 'start_ISO_Engine',
	stopISOEngine = 'stop_ISO_Engine',
	standbyISOEngine = 'standby_ISO_Engine',
	addOutput = 'add_Output',
	setOutputCount = 'set_Output_Count',
	enableOutput = 'enable_Output',
	disableOutput = 'disable_Output',
	loadISOConfig = 'load_ISO_Config',
	saveISOConfig = 'save_ISO_Config',
	mergeISOConfig = 'merge_ISO_Config',
	getConfigPath = 'get_Config_Path',
	setOutputMode = 'set_Output_Mode',
	setOutputType = 'set_Output_Type',
	setAudioMode = 'set_Audio_Mode',
	acceptRecordingConsent = 'accept_Recording_Consent',
	selectionMethod = 'selection_Method',
	selectUser = 'select_User',
	selectUserByName = 'select_User_By_Name',
	selectGroup = 'select_Group',
	selectUserFromGroupPosition = 'select_User_From_Group_Position',
	selectFromGalleryPosition = 'select_From_Gallery_Position',
	selectFromIndexPosition = 'select_From_Index_Position',
	clearParticipants = 'clear_Participants',
	addToGroup = 'add_To_Group',
	clearGroup = 'clear_Group',
	removeFromGroup = 'remove_From_Group',
	rename = 'rename',
	renameGroup = 'rename_Group',
	nextParticipants = 'next_Participants',
	previousParticipants = 'previous_Participants',
	resetParticipants = 'reset_Participants',
	selectOutput = 'select_Output',
	selectAudioChannel = 'select_Audio_Channel',
	applyOutput = 'apply_Output',
	applyChannel = 'apply_Channel',
	applyOutputs = 'apply_Outputs',
	pin = 'pin',
	addPin = 'add_Pin',
	openBreakoutRooms = 'open_Breakout_Rooms',
	unpin = 'unpin',
	clearPins = 'clear_Pins',
	togglePin = 'toggle_Pin',
	pinScreen2 = 'pin_Screen2',
	unPinScreen2 = 'unPinScreen2',
	clearPinsScreen2 = 'clearPinsScreen2',
	togglePinScreen2 = 'togglePinScreen2',
	addSpotlight = 'addSpotlight',
	spotLight = 'spotLight',
	unSpotLight = 'unSpotLight',
	toggleSpotlight = 'toggleSpotlight',
	turnVideoOn = 'turnVideoOn',
	turnVideoOff = 'turnVideoOff',
	toggleVideoState = 'toggleVideoState',
	mute = 'mute',
	unmute = 'unmute',
	toggleMuteState = 'toggleMuteState',
	raiseHand = 'raiseHand',
	lowerHand = 'lowerHand',
	toggleHand = 'toggleHand',
	makeHost = 'makeHost',
	makeCoHost = 'makeCoHost',
	revokeCoHost = 'revokeCoHost',
	reclaimHost = 'reclaimHost',
	makePanelist = 'makePanelist',
	makeAttendee = 'makeAttendee',
	ejectParticipant = 'ejectParticipant',
	returnSelfToMainMeeting = 'returnSelfToMainMeeting',
	admitSomeoneFromWaitingRoom = 'admitSomeoneFromWaitingRoom',
	sendSomeoneToWaitingRoom = 'sendSomeoneToWaitingRoom',
	allowWebinarAttendeeToSpeak = 'allowWebinarAttendeeToSpeak',
	disallowToSpeak = 'disallowToSpeak',
	startScreenShareWithPrimaryScreen = 'startScreenShareWithPrimaryScreen',
	cycleSharedCameraToNextAvailable = 'cycleSharedCameraToNextAvailable',
	gotoNextGalleryPage = 'gotoNextGalleryPage',
	gotoPreviousGalleryPage = 'gotoPreviousGalleryPage',
	stopSharing = 'stopSharing',
	allowToRecord = 'allowToRecord',
	disallowToRecord = 'disallowToRecord',
	hideNonVideoParticipants = 'hideNonVideoParticipants',
	showNonVideoParticipants = 'showNonVideoParticipants',
	setSpeakerView = 'setSpeakerView',
	requestOrderOfGalleryView = 'requestOrderOfGalleryView',
	configureBreakoutRooms = 'configureBreakoutRooms',
	startCameraShare = 'startCameraShare',
	listUsers = 'listUsers',
	pingZoomOSC = 'pingZoomOSC',
	disableWaitingRoom = 'disableWaitingRoom',
	enableWaitingRoom = 'enableWaitingRoom',
	requestGalleryCount = 'requestGalleryCount',
	startLocalRecording = 'startLocalRecording',
	sendParticipantToBreakoutRoom = 'sendParticipantToBreakoutRoom',
	hideUserNamesOnVideo = 'hideUserNamesOnVideo',
	showUserNamesOnVideo = 'showUserNamesOnVideo',
	enableOriginalSound = 'enableOriginalSound',
	disableOriginalSound = 'disableOriginalSound',
	enableHDVideo = 'enableHDVideo',
	disableHDVideo = 'disableHDVideo',
	enableMirrorVideo = 'enableMirrorVideo',
	disableMirrorVideo = 'disableMirrorVideo',
	enableOptimizeVideoForSharing = 'enableOptimizeVideoForSharing',
	disableOptimizeVideoForSharing = 'disableOptimizeVideoForSharing',
	disableComputerSoundWhenSharing = 'disableComputerSoundWhenSharing',
	removeParticipantFromBreakoutRoom = 'removeParticipantFromBreakoutRoom',
	assignParticipantToBreakoutRoom = 'assignParticipantToBreakoutRoom',
	unassignParticipantFromBreakoutRoom = 'unassignParticipantFromBreakoutRoom',
	setGalleryView = 'setGalleryView',
	muteAll = 'muteAll',
	unmuteAll = 'unmuteAll',
	muteAllExcept = 'muteAllExcept',
	clearSpotlight = 'clearSpotlight',
	enableComputerSoundWhenSharing = 'enableComputerSoundWhenSharing',
	disableUsersToUnmute = 'disableUsersToUnmute',
	lowerAllHands = 'lowerAllHands',
	enableUsersToUnmute = 'enableUsersToUnmute',
	closeBreakoutRooms = 'closeBreakoutRooms',
	deleteAllBreakoutRooms = 'deleteAllBreakoutRooms',
	admitEveryoneFromWaitingRoom = 'admitEveryoneFromWaitingRoom',
	ejectAll = 'ejectAll',
	pauseLocalRecording = 'pauseLocalRecording',
	resumeLocalRecording = 'resumeLocalRecording',
	stopLocalRecording = 'stopLocalRecording',
	startCloudRecording = 'startCloudRecording',
	requestListOfBreakoutRooms = 'requestListOfBreakoutRooms',
	leaveMeeting = 'leaveMeeting',
	resumeCloudRecording = 'resumeCloudRecording',
	stopCloudRecording = 'stopCloudRecording',
	pauseCloudRecording = 'pauseCloudRecording',
	endMeeting = 'endMeeting',
	SetWindowPosition = 'SetWindowPosition',
	SetWindowSize = 'SetWindowSize',
	customCommandWithArguments = 'customCommandWithArguments',
	customCommand = 'customCommand',
	ZAKStartMeeting = 'ZAKStartMeeting',
	ZAKJoinMeeting = 'ZAKJoinMeeting',
	sendMessageToWaitingRoom = 'sendMessageToWaitingRoom',
	startShareWithWindow = 'startShareWithWindow',
	startAudioShare = 'startAudioShare',
	startScreenShare = 'startScreenShare',
	sendAChatViaDM = 'sendAChatViaDM',
	sendAChatToEveryone = 'sendAChatToEveryone',
	createBreakoutRoom = 'createBreakoutRoom',
	deleteBreakoutRoom = 'deleteBreakoutRoom',
	setMicLevel = 'setMicLevel',
	setMicDevice = 'setMicDevice',
	setSpeakerDevice = 'setSpeakerDevice',
	setSpeakerVolume = 'setSpeakerVolume',
	setCameraDevice = 'setCameraDevice',
	setVideoFilter = 'setVideoFilter',
	setVirtualBackground = 'setVirtualBackground',
	broadcastMessageToBreakoutRooms = 'broadcastMessageToBreakoutRooms',
	joinMeeting = 'joinMeeting',
}

/**
 * Main function to create the actions
 * @param instance Give the instance so we can extract data
 * @returns CompanionActions
 */
export function GetActions(instance: InstanceBaseExt<ZoomConfig>): CompanionActionDefinitions {
	// Make list of users ready for Companion
	const CHOICES_USERS = [{ id: '0', label: 'no users' }]
	const CHOICES_GROUPS: { id: string; label: string }[] = []
	let CHOICES_USERS_DEFAULT = '0'
	const CHOICES_GROUPS_DEFAULT = '0'
	if (instance.ZoomUserData) {
		CHOICES_USERS.length = 0
		for (const key in instance.ZoomUserData) {
			if (Object.prototype.hasOwnProperty.call(instance.ZoomUserData, key)) {
				const user = instance.ZoomUserData[key]
				CHOICES_USERS.push({ id: user.zoomId.toString(), label: user.userName })
				CHOICES_USERS_DEFAULT = user.zoomId.toString()
			}
		}
	}
	instance.ZoomGroupData.forEach((group: { groupName: any }, index: { toString: () => any }) => {
		CHOICES_GROUPS.push({ id: index.toString(), label: group.groupName })
	})
	const CHOICES_POSITION = []
	for (let index = 1; index < 50; index++) {
		CHOICES_POSITION.push({ id: index.toString(), label: `Position ${index}` })
	}
	const CHOICES_PARTICIPANT = []
	for (let index = 1; index < 1000; index++) {
		CHOICES_PARTICIPANT.push({ id: index.toString(), label: `Participant ${index}` })
	}

	const CHOICES_OUTPUTS = []
	// Change this to actual created output, get that with pulling
	for (let index = 1; index < 10; index++) {
		CHOICES_OUTPUTS.push({ id: index, label: `Output ${index}` })
	}

	const userOption: any = {
		type: 'dropdown',
		label: 'User',
		id: 'user',
		default: CHOICES_USERS_DEFAULT,
		choices: CHOICES_USERS,
	}

	const galleryOrderOption: SomeCompanionActionInputField = {
		type: 'dropdown',
		label: 'Position',
		id: 'position',
		default: '0',
		choices: CHOICES_POSITION,
	}

	const participantOption: SomeCompanionActionInputField = {
		type: 'dropdown',
		label: 'Position',
		id: 'position',
		default: '0',
		choices: CHOICES_PARTICIPANT,
	}

	const groupOption: SomeCompanionActionInputField = {
		type: 'dropdown',
		label: 'Group',
		id: 'group',
		default: CHOICES_GROUPS_DEFAULT,
		choices: CHOICES_GROUPS,
	}

	const outputOption: SomeCompanionActionInputField = {
		type: 'dropdown',
		label: 'Output',
		id: 'output',
		default: 1,
		choices: CHOICES_OUTPUTS,
	}

	/**
	 * Construct the command like I want and send it to the OSC
	 * @param action
	 * @param _info
	 */
	const sendActionCommand = (
		action: { options: { command: any; args: any } },
		_info?: CompanionActionEvent | null
	): void => {
		// Construct command
		const oscPath = action.options.command
		const args = action.options.args
		instance.log('debug', `Sending ${JSON.stringify(oscPath)}, with arguments ${JSON.stringify(args)}`)
		if (instance.OSC) instance.OSC.sendCommand(oscPath, args)
	}

	const actions: { [id in ActionId]: CompanionActionDefinition | undefined } = {
		[ActionId.setAudioGainReduction]: {
			name: 'set Audio Gain Reduction',
			options: [options.channel, options.reductionAmount],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand('/setAudioGainReduction')
				command.args.push({ type: 'i', value: action.options.channel })
				command.args.push({ type: 'i', value: action.options.reductionAmount })

				const sendToCommand = {
					id: ActionId.setAudioGainReduction,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setOutputSelection]: {
			name: 'set Output Selection',
			options: [options.output, options.reductionAmount],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand('/setOutputSelection')
				command.args.push({ type: 'i', value: action.options.output })
				command.args.push({ type: 'i', value: action.options.reductionAmount })

				const sendToCommand = {
					id: ActionId.setOutputSelection,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setAudioSelection]: {
			name: 'set Audio Selection',
			options: [options.output, options.reductionAmount],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand('/setAudioSelection')
				command.args.push({ type: 'i', value: action.options.channel })
				command.args.push({ type: 'i', value: action.options.reductionAmount })

				const sendToCommand = {
					id: ActionId.setAudioSelection,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setOutputEmbeddedAudio]: {
			name: 'set Output Embedded Audio',
			options: [options.output, options.mode],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand('/setOutputEmbeddedAudio')
				command.args.push({ type: 'i', value: action.options.output })
				command.args.push({ type: 'i', value: action.options.mode })

				const sendToCommand = {
					id: ActionId.setOutputEmbeddedAudio,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setVideoLossMode]: {
			name: 'set Video Loss Mode',
			options: [options.videoLossMode],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand('/setVideoLossMode')
				command.args.push({ type: 's', value: action.options.videoLossMode })

				const sendToCommand = {
					id: ActionId.setVideoLossMode,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setOutputName]: {
			name: 'set Output Name',
			options: [options.output, options.name],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand('/setOutputName')
				command.args.push({ type: 'i', value: action.options.output })
				command.args.push({ type: 's', value: action.options.name })

				const sendToCommand = {
					id: ActionId.setOutputName,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.deleteOutput]: {
			name: 'delete Output',
			options: [options.output],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand('/deleteOutput')
				command.args.push({ type: 'i', value: action.options.output })

				const sendToCommand = {
					id: ActionId.deleteOutput,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.outputISO]: {
			name: 'output ISO',
			options: [options.userName, options.output],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand('/outputISO', action.options.userName, false)
				command.args.push({ type: 'i', value: action.options.output })

				const sendToCommand = {
					id: ActionId.outputISO,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.audioISO]: {
			name: 'audio ISO',
			options: [options.userName, options.output],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand('/audioISO', action.options.userName, true)
				command.args.push({ type: 'i', value: action.options.output })

				const sendToCommand = {
					id: ActionId.audioISO,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.startISOEngine]: {
			name: 'Start ISO Engine',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				const command = createCommand('/startISOEngine')

				const sendToCommand = {
					id: ActionId.startISOEngine,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.stopISOEngine]: {
			name: 'Stop ISO Engine',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				const command = createCommand('/stopISOEngine')

				const sendToCommand = {
					id: ActionId.stopISOEngine,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.standbyISOEngine]: {
			name: 'Standby ISO Engine',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				const command = createCommand('/standbyISOEngine')

				const sendToCommand = {
					id: ActionId.standbyISOEngine,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.addOutput]: {
			name: 'addOutput',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				const command = createCommand('/addOutput')

				const sendToCommand = {
					id: ActionId.addOutput,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setOutputCount]: {
			name: 'set Output Count',
			options: [options.count],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand('/setOutputCount')
				command.args.push({ type: 'i', value: action.options.count })
				const sendToCommand = {
					id: ActionId.setOutputCount,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.enableOutput]: {
			name: 'enableOutput',
			options: [options.output],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand('/enableOutput')
				command.args.push({ type: 'i', value: action.options.output })
				const sendToCommand = {
					id: ActionId.setOutputCount,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.disableOutput]: {
			name: 'disableOutput',
			options: [options.output],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand('/disableOutput')
				command.args.push({ type: 'i', value: action.options.output })
				const sendToCommand = {
					id: ActionId.disableOutput,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.loadISOConfig]: {
			name: 'Load Config',
			options: [options.path],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand('/loadConfig')
				command.args.push({ type: 'i', value: action.options.path })
				const sendToCommand = {
					id: ActionId.disableOutput,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.saveISOConfig]: {
			name: 'Save Config',
			options: [options.path],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand('/saveConfig')
				command.args.push({ type: 'i', value: action.options.path })
				const sendToCommand = {
					id: ActionId.saveISOConfig,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.mergeISOConfig]: {
			name: 'Merge Config',
			options: [options.path],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand('/mergeConfig')
				command.args.push({ type: 'i', value: action.options.path })
				const sendToCommand = {
					id: ActionId.mergeISOConfig,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.getConfigPath]: {
			name: 'getConfig path',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				const command = createCommand('/getConfigPath')
				const sendToCommand = {
					id: ActionId.getConfigPath,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setOutputMode]: {
			name: 'setOutputMode',
			options: [options.output],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand('/setOutputMode')
				command.args.push({ type: 'i', value: action.options.output })
				const sendToCommand = {
					id: ActionId.setOutputMode,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setOutputType]: {
			name: 'setOutputType',
			options: [options.output],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand('/setOutputType')
				command.args.push({ type: 'i', value: action.options.output })
				const sendToCommand = {
					id: ActionId.setOutputType,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setAudioMode]: {
			name: 'setAudioMode',
			options: [options.channel],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand('/setAudioMode')
				command.args.push({ type: 'i', value: action.options.output })
				const sendToCommand = {
					id: ActionId.setAudioMode,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.acceptRecordingConsent]: {
			name: 'Accept Recording Consent',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				const command = createCommand('/acceptRecordingConsent')
				const sendToCommand = {
					id: ActionId.acceptRecordingConsent,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		// Select Actions
		[ActionId.selectionMethod]: {
			name: 'Selection method',
			options: [
				{
					type: 'dropdown',
					label: 'Single/Multi',
					id: 'selectionMethod',
					default: 1,
					choices: [
						{ label: 'Single select', id: 1 },
						{ label: 'Multi select', id: 0 },
						{ label: 'Toggle', id: 2 },
					],
				},
			],
			callback: (action) => {
				if (action.options.selectionMethod === 2) {
					instance.config.selectionMethod === 1
						? (instance.config.selectionMethod = 0)
						: (instance.config.selectionMethod = 1)
				} else {
					instance.config.selectionMethod = action.options.selectionMethod as number
				}
				instance.saveConfig(instance.config)
				instance.checkFeedbacks(FeedbackId.selectionMethod, FeedbackId.groupBased)
			},
		},
		[ActionId.selectUser]: {
			name: 'Preselect user',
			options: [
				userOption,
				{
					type: 'dropdown',
					label: 'Option',
					id: 'option',
					default: '',
					choices: [
						{ label: 'Toggle', id: 'toggle' },
						{ label: 'Select', id: 'select' },
						{ label: 'Remove', id: 'remove' },
					],
				},
			],
			callback: (action) => {
				switch (action.options.option) {
					case 'toggle':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers = arrayAddRemove(
							instance.ZoomClientDataObj.selectedCallers,
							action.options.user as number
						)
						break
					case 'select':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						if ((action.options.user as number) < instance.ZoomClientDataObj.numberOfGroups + 1)
							instance.ZoomClientDataObj.selectedCallers.push(action.options.user as number)
						break
					case 'remove':
						instance.ZoomClientDataObj.selectedCallers = arrayRemove(
							instance.ZoomClientDataObj.selectedCallers,
							action.options.user as number
						)
						break
				}
				instance.UpdateVariablesValues()
				instance.checkFeedbacks(FeedbackId.indexBased, FeedbackId.groupBased, FeedbackId.userNameBased)
			},
		},
		[ActionId.selectUserByName]: {
			name: 'Preselect user by name',
			options: [
				{
					type: 'textinput',
					label: 'name',
					id: 'name',
					default: '',
				},
				{
					type: 'dropdown',
					label: 'Option',
					id: 'option',
					default: 'toggle',
					choices: [
						{ label: 'Toggle', id: 'toggle' },
						{ label: 'Select', id: 'select' },
						{ label: 'Remove', id: 'remove' },
					],
				},
			],
			callback: async (action) => {
				const selectedName = await instance.parseVariablesInString(action.options.name as string)
				for (const key in instance.ZoomUserData) {
					if (Object.prototype.hasOwnProperty.call(instance.ZoomUserData, key)) {
						const user = instance.ZoomUserData[key]
						if (user.userName === selectedName) {
							switch (action.options.option) {
								case 'toggle':
									if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
									//find user in list
									instance.ZoomClientDataObj.selectedCallers = arrayAddRemove(
										instance.ZoomClientDataObj.selectedCallers,
										user.zoomId
									)
									break
								case 'select':
									if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
									instance.ZoomClientDataObj.selectedCallers.push(user.zoomId)
									break
								case 'remove':
									instance.ZoomClientDataObj.selectedCallers = arrayRemove(
										instance.ZoomClientDataObj.selectedCallers,
										user.zoomId
									)
									break
							}
							instance.UpdateVariablesValues()
							instance.checkFeedbacks(
								FeedbackId.groupBased,
								FeedbackId.indexBased,
								FeedbackId.userNameBased,
								FeedbackId.galleryBased
							)
						}
					}
				}
			},
		},
		[ActionId.selectGroup]: {
			name: 'Preselect group',
			options: [groupOption],
			callback: (action) => {
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.ZoomGroupData[action.options.group as number].users?.forEach((user: { zoomID: any }) => {
					instance.ZoomClientDataObj.selectedCallers.push(user.zoomID)
				})
				instance.UpdateVariablesValues()
				instance.checkFeedbacks(
					FeedbackId.groupBased,
					FeedbackId.indexBased,
					FeedbackId.userNameBased,
					FeedbackId.galleryBased
				)
			},
		},
		[ActionId.selectUserFromGroupPosition]: {
			name: 'Preselect user by group Position',
			options: [
				groupOption,
				galleryOrderOption,
				{
					type: 'dropdown',
					label: 'Option',
					id: 'option',
					default: '',
					choices: [
						{ label: 'Toggle', id: 'toggle' },
						{ label: 'Select', id: 'select' },
						{ label: 'Remove', id: 'remove' },
					],
				},
			],
			callback: (action) => {
				const position = (action.options.position as number) - 1
				switch (action.options.option) {
					case 'toggle':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers = arrayAddRemove(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomGroupData[action.options.group as number].users[position].zoomID
						)
						break
					case 'select':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers.push(
							instance.ZoomGroupData[action.options.group as number].users[position].zoomID
						)
						break
					case 'remove':
						instance.ZoomClientDataObj.selectedCallers = arrayRemove(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomGroupData[action.options.group as number].users[position].zoomID
						)
						break
				}
				instance.UpdateVariablesValues()
				instance.checkFeedbacks(
					FeedbackId.groupBased,
					FeedbackId.indexBased,
					FeedbackId.userNameBased,
					FeedbackId.galleryBased
				)
			},
		},
		[ActionId.selectFromGalleryPosition]: {
			name: 'Preselect user by Gallery Position',
			options: [
				galleryOrderOption,
				{
					type: 'dropdown',
					label: 'Option',
					id: 'option',
					default: '',
					choices: [
						{ label: 'Toggle', id: 'toggle' },
						{ label: 'Select', id: 'select' },
						{ label: 'Remove', id: 'remove' },
					],
				},
			],
			callback: (action) => {
				switch (action.options.option) {
					case 'toggle':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers = arrayAddRemove(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomClientDataObj.galleryOrder[(action.options.position as number) - 1]
						)
						break
					case 'select':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers.push(
							instance.ZoomClientDataObj.galleryOrder[(action.options.position as number) - 1]
						)
						break
					case 'remove':
						instance.ZoomClientDataObj.selectedCallers = arrayRemove(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomClientDataObj.galleryOrder[(action.options.position as number) - 1]
						)
						break
				}
				instance.UpdateVariablesValues()
				instance.checkFeedbacks(
					FeedbackId.groupBased,
					FeedbackId.indexBased,
					FeedbackId.userNameBased,
					FeedbackId.galleryBased
				)
			},
		},
		[ActionId.selectFromIndexPosition]: {
			name: 'Preselect user by Participant Index',
			options: [
				participantOption,
				{
					type: 'dropdown',
					label: 'Option',
					id: 'option',
					default: '',
					choices: [
						{ label: 'Toggle', id: 'toggle' },
						{ label: 'Select', id: 'select' },
						{ label: 'Remove', id: 'remove' },
					],
				},
			],
			callback: (action) => {
				switch (action.options.option) {
					case 'toggle':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers = arrayAddRemove(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomVariableLink[(action.options.position as number) - 1].zoomId
						)
						break
					case 'select':
						if (instance.config.selectionMethod === 1) instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers.push(
							instance.ZoomVariableLink[(action.options.position as number) - 1].zoomId
						)
						break
					case 'remove':
						instance.ZoomClientDataObj.selectedCallers = arrayRemove(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomVariableLink[(action.options.position as number) - 1].zoomId
						)
						break
				}
				instance.UpdateVariablesValues()
				instance.checkFeedbacks(
					FeedbackId.groupBased,
					FeedbackId.indexBased,
					FeedbackId.userNameBased,
					FeedbackId.galleryBased
				)
			},
		},
		[ActionId.clearParticipants]: {
			name: 'Clear Participants',
			options: [],
			callback: () => {
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.UpdateVariablesValues()
				instance.checkFeedbacks(
					FeedbackId.groupBased,
					FeedbackId.indexBased,
					FeedbackId.userNameBased,
					FeedbackId.galleryBased
				)
			},
		},
		// Group Actions
		[ActionId.addToGroup]: {
			name: 'Add selection to group',
			options: [
				groupOption,
				{
					type: 'dropdown',
					label: 'Add or set',
					id: 'groupOption',
					default: 'add',
					choices: [
						{ label: 'Add', id: 'add' },
						{ label: 'Set', id: 'set' },
					],
				},
			],
			callback: (action) => {
				if (action.options.groupOption === 'set') {
					instance.ZoomGroupData[action.options.group as number].users.length = 0
				}
				instance.ZoomClientDataObj.selectedCallers.forEach((zoomID: string | number) => {
					if (
						!instance.ZoomGroupData[action.options.group as number].users.find(
							(o: { zoomID: string | number }) => o.zoomID === zoomID
						)
					) {
						instance.ZoomGroupData[action.options.group as number].users.push({
							zoomID: zoomID as number,
							userName: instance.ZoomUserData[zoomID as number].userName,
						})
					}
				})
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.UpdateVariablesValues()
				instance.checkFeedbacks(
					FeedbackId.groupBased,
					FeedbackId.indexBased,
					FeedbackId.userNameBased,
					FeedbackId.galleryBased
				)
			},
		},
		[ActionId.clearGroup]: {
			name: 'Clear group selection',
			options: [groupOption],
			callback: (action) => {
				instance.ZoomGroupData[action.options.group as number].users.length = 0
				instance.UpdateVariablesValues()
				instance.checkFeedbacks(FeedbackId.groupBased)
			},
		},
		[ActionId.removeFromGroup]: {
			name: 'Remove from group',
			options: [userOption, groupOption],
			callback: (action) => {
				if (instance.ZoomUserData[action.options.group as number].users !== undefined) {
					for (let i = 0; i < instance.ZoomUserData[action.options.group as number].users.length; i++) {
						if (instance.ZoomUserData[action.options.group as number].users[i] === action.options.user) {
							instance.ZoomUserData[action.options.group as number].users.splice(i, 1)
						}
					}
				}
				instance.UpdateVariablesValues()
			},
		},
		// Rename Actions
		[ActionId.rename]: {
			name: 'Rename',
			options: [userOption, options.name],
			callback: (action) => {
				const oscPath = `/zoom/zoomID/rename`
				const sendToCommand: any = {
					id: 'rename',
					options: {
						command: oscPath,
						args: [
							{ type: 'i', value: action.options.user },
							{ type: 's', value: action.options.name },
						],
					},
				}
				sendActionCommand(sendToCommand)
				// Also update locally
				let ZoomID = action.options.user as number
				instance.ZoomUserData[ZoomID].userName = action.options.name as string
				// Update position and group
				const index = instance.ZoomVariableLink.findIndex((finduser: { zoomId: number }) => finduser.zoomId === ZoomID)
				if (index !== -1) instance.ZoomVariableLink[index].userName = action.options.name as string
				instance.ZoomGroupData.forEach((group: ZoomGroupDataInterface) => {
					group.users.forEach((user) => {
						if (user.zoomID === ZoomID) user.userName = action.options.name as string
					})
				})
				instance.UpdateVariablesValues()
			},
		},
		[ActionId.renameGroup]: {
			name: 'Rename Group',
			options: [groupOption, options.name],
			callback: (action) => {
				instance.ZoomGroupData[action.options.group as number].groupName = action.options.name as string
				instance.UpdateVariablesValues()
			},
		},
		[ActionId.nextParticipants]: {
			name: 'nextParticipants',
			options: [
				{
					type: 'number',
					label: 'Number of buttons',
					id: 'shift',
					default: 30,
					min: 1,
					max: 32,
				},
			],
			callback: (action) => {
				// Grap the items you want to see
				const numberToShift = action.options.shift as number
				const itemsToShift: { zoomId: number; userName: string }[] = instance.ZoomVariableLink.slice(0, numberToShift)
				instance.ZoomVariableLink.splice(0, numberToShift)
				instance.ZoomVariableLink.push(...itemsToShift)

				instance.UpdateVariablesValues()
				instance.checkFeedbacks(
					FeedbackId.groupBased,
					FeedbackId.indexBased,
					FeedbackId.userNameBased,
					FeedbackId.galleryBased
				)
			},
		},
		[ActionId.previousParticipants]: {
			name: 'previousParticipants',
			options: [
				{
					type: 'number',
					label: 'Number of buttons',
					id: 'shift',
					default: 30,
					min: 1,
					max: 32,
				},
			],
			callback: (action) => {
				// Grap the items you want to see
				const numberToShift = action.options.shift as number
				// Be carefull for below/invallid index
				const itemsToShift: { zoomId: number; userName: string }[] = instance.ZoomVariableLink.slice(-numberToShift)

				instance.ZoomVariableLink.splice(instance.ZoomVariableLink.length - numberToShift, numberToShift)
				instance.ZoomVariableLink.splice(0, 0, ...itemsToShift)

				instance.UpdateVariablesValues()
				instance.checkFeedbacks(
					FeedbackId.groupBased,
					FeedbackId.indexBased,
					FeedbackId.userNameBased,
					FeedbackId.galleryBased
				)
			},
		},
		[ActionId.resetParticipants]: {
			name: 'resetParticipants',
			description: 'This will reset the order based on the original meeting',
			options: [],
			callback: () => {
				instance.ZoomVariableLink.length = 0
				for (const key in instance.ZoomUserData) {
					if (Object.prototype.hasOwnProperty.call(instance.ZoomUserData, key)) {
						const user = instance.ZoomUserData[key]
						instance.ZoomVariableLink.push({ zoomId: user.zoomId, userName: user.userName })
					}
				}

				instance.UpdateVariablesValues()
				instance.checkFeedbacks(
					FeedbackId.groupBased,
					FeedbackId.indexBased,
					FeedbackId.userNameBased,
					FeedbackId.galleryBased
				)
			},
		},
		// ISO Actions
		[ActionId.selectOutput]: {
			name: 'Select output',
			options: [outputOption],
			callback: (action) => {
				const outputNumber: number = action.options.output as number
				const index = instance.ZoomClientDataObj.selectedOutputs.indexOf(outputNumber)
				// instance.log('debug', `outputNumber: ${outputNumber} selectedOutputs: ${JSON.stringify(instance.ZoomClientDataObj.selectedOutputs)}`)
				if (index > -1) {
					instance.ZoomClientDataObj.selectedOutputs.splice(index, 1)
				} else {
					instance.ZoomClientDataObj.selectedOutputs.push(outputNumber)
				}
				// instance.log('debug', `outputNumber: ${outputNumber} selectedOutputs: ${JSON.stringify(instance.ZoomClientDataObj.selectedOutputs)}`)
				instance.checkFeedbacks(FeedbackId.output)
			},
		},
		[ActionId.selectAudioChannel]: {
			name: 'Select audio channel',
			options: [outputOption],
			callback: (action) => {
				const index = instance.ZoomClientDataObj.selectedAudioOutputs.indexOf(action.options.output as number)
				if (index > -1) {
					instance.ZoomClientDataObj.selectedAudioOutputs.splice(index, 1)
				} else {
					instance.ZoomClientDataObj.selectedAudioOutputs.push(action.options.output as number)
				}
				instance.checkFeedbacks(FeedbackId.audioOutput)
			},
		},
		[ActionId.applyOutput]: {
			name: 'Apply output',
			options: [],
			callback: () => {
				const args: { type: string; value: string | number }[] = []
				if (instance.ZoomClientDataObj.selectedCallers[0] && instance.ZoomClientDataObj.selectedOutputs[0]) {
					args.push({ type: 'i', value: instance.ZoomClientDataObj.selectedCallers[0] })
					args.push({ type: 'i', value: instance.ZoomClientDataObj.selectedOutputs[0] })
					const sendToCommand: any = {
						id: 'outputISO',
						options: {
							command: '/zoom/zoomID/outputISO',
							args: args,
						},
					}
					sendActionCommand(sendToCommand)
					// reset arrays
					instance.ZoomClientDataObj.selectedCallers.length = 0
					instance.ZoomClientDataObj.selectedOutputs.length = 0
					instance.UpdateVariablesValues()
					instance.checkFeedbacks(
						FeedbackId.groupBased,
						FeedbackId.indexBased,
						FeedbackId.userNameBased,
						FeedbackId.galleryBased,
						FeedbackId.output
					)
				}
			},
		},
		[ActionId.applyChannel]: {
			name: 'Apply channel',
			options: [],
			callback: () => {
				const args: { type: string; value: string | number }[] = []
				if (instance.ZoomClientDataObj.selectedCallers[0] && instance.ZoomClientDataObj.selectedOutputs[0]) {
					args.push({ type: 'i', value: instance.ZoomClientDataObj.selectedCallers[0] })
					args.push({ type: 'i', value: instance.ZoomClientDataObj.selectedOutputs[0] })
					const sendToCommand: any = {
						id: 'audioISO',
						options: {
							command: '/zoom/zoomID/audioISO',
							args: args,
						},
					}
					sendActionCommand(sendToCommand)
					// reset arrays
					instance.ZoomClientDataObj.selectedCallers.length = 0
					instance.ZoomClientDataObj.selectedOutputs.length = 0
					instance.UpdateVariablesValues()
					instance.checkFeedbacks(
						FeedbackId.groupBased,
						FeedbackId.indexBased,
						FeedbackId.userNameBased,
						FeedbackId.galleryBased,
						FeedbackId.output
					)
				}
			},
		},
		[ActionId.applyOutputs]: {
			name: 'Apply selected outputs',
			options: [],
			callback: () => {
				let args: { type: string; value: string | number }[] = []
				for (let index = 0; index < instance.ZoomClientDataObj.selectedOutputs.length; index++) {
					// only fill up outputs when there are users
					if (instance.ZoomClientDataObj.selectedCallers[index]) {
						args.push({ type: 'i', value: instance.ZoomClientDataObj.selectedCallers[index] })
						args.push({ type: 'i', value: instance.ZoomClientDataObj.selectedOutputs[index] })
					}

					const sendToCommand: any = {
						id: 'outputISO',
						options: {
							command: '/zoom/zoomID/outputISO',
							args: args,
						},
					}
					sendActionCommand(sendToCommand)
					args = []
				}

				// reset arrays
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.ZoomClientDataObj.selectedOutputs.length = 0
				instance.UpdateVariablesValues()
				instance.checkFeedbacks(
					FeedbackId.groupBased,
					FeedbackId.indexBased,
					FeedbackId.userNameBased,
					FeedbackId.galleryBased,
					FeedbackId.output
				)
			},
		},
		[ActionId.pin]: {
			name: 'Pin',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/pin', action.options.userName, select.single)
				const sendToCommand = {
					id: ActionId.pin,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.addPin]: {
			name: 'Add Pin',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/addPin', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.addPin,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.unpin]: {
			name: 'Unpin',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/unPin', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.unpin,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.clearPins]: {
			name: 'Clear Pins',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/clearPin')
				const sendToCommand = {
					id: ActionId.clearPins,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.togglePin]: {
			name: 'Toggle Pin',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/togglePin')
				const sendToCommand = {
					id: ActionId.togglePin,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.pinScreen2]: {
			name: 'Pin Screen2',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/pin2', action.options.userName, select.single)
				const sendToCommand = {
					id: ActionId.pinScreen2,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.unPinScreen2]: {
			name: 'Unpin Screen2',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/unPin2', action.options.userName, select.single)
				const sendToCommand = {
					id: ActionId.unPinScreen2,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.clearPinsScreen2]: {
			name: 'Clear PinsScreen2',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/clearPin2')
				const sendToCommand = {
					id: ActionId.clearPinsScreen2,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.togglePinScreen2]: {
			name: 'Toggle PinScreen2',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/togglePin2', action.options.userName, select.single)
				const sendToCommand = {
					id: ActionId.togglePinScreen2,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.spotLight]: {
			name: 'Spotlight',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/spot', action.options.userName, select.single)
				const sendToCommand = {
					id: ActionId.spotLight,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.addSpotlight]: {
			name: 'Add Spotlight',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/addSpot', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.addSpotlight,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.unSpotLight]: {
			name: 'Un Spotlight',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/unSpot', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.unSpotLight,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.toggleSpotlight]: {
			name: 'Toggle Spotlight',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/toggleSpot', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.toggleSpotlight,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.turnVideoOn]: {
			name: 'Video On',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/videoOn', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.turnVideoOn,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.turnVideoOff]: {
			name: 'Video Off',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/videoOff', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.turnVideoOff,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.toggleVideoState]: {
			name: 'Toggle Video State',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/toggleVideo', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.toggleVideoState,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.mute]: {
			name: 'Mute',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/mute', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.mute,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.unmute]: {
			name: 'Unmute',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/unMute', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.unmute,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.toggleMuteState]: {
			name: 'Toggle Mute State',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/toggleMute', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.toggleMuteState,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.raiseHand]: {
			name: 'Raise Hand',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/raiseHand', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.raiseHand,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.lowerHand]: {
			name: 'Lower Hand',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/lowerHand', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.lowerHand,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.toggleHand]: {
			name: 'Toggle Hand',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/toggleHand', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.toggleHand,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.makeHost]: {
			name: 'Make Host',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/makeHost', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.makeHost,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.makeCoHost]: {
			name: 'Make CoHost',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/makeCoHost', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.makeCoHost,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.revokeCoHost]: {
			name: 'Revoke CoHost',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/revokeCoHost', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.revokeCoHost,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.reclaimHost]: {
			name: 'Reclaim Host',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/reclaimHost', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.reclaimHost,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.makePanelist]: {
			name: 'Make Panelist',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/makePanelist', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.makePanelist,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.makeAttendee]: {
			name: 'Make Attendee',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/makeAttendee', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.makeAttendee,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.ejectParticipant]: {
			name: 'Eject Participant',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/eject', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.ejectParticipant,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.returnSelfToMainMeeting]: {
			name: 'Return Self To Main Meeting',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/returnToMainMeeting', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.returnSelfToMainMeeting,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.admitSomeoneFromWaitingRoom]: {
			name: 'Admit Participant',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/admit', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.admitSomeoneFromWaitingRoom,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.sendSomeoneToWaitingRoom]: {
			name: 'Send To Waiting Room',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/sendToWaitingRoom', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.sendSomeoneToWaitingRoom,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.allowWebinarAttendeeToSpeak]: {
			name: 'Allow to Speak',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/allowToSpeak', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.allowWebinarAttendeeToSpeak,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.disallowToSpeak]: {
			name: 'Disallow to Speak',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/disallowToSpeak', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.disallowToSpeak,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.startScreenShareWithPrimaryScreen]: {
			name: 'Share Primary Screen',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/startScreenSharePrimary')
				const sendToCommand = {
					id: ActionId.startScreenShareWithPrimaryScreen,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.cycleSharedCameraToNextAvailable]: {
			name: 'Cycle Shared Camera To Next Available',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/shareNextCamera')
				const sendToCommand = {
					id: ActionId.cycleSharedCameraToNextAvailable,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.stopSharing]: {
			name: 'Stop Sharing',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/stopShare')
				const sendToCommand = {
					id: ActionId.stopSharing,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.allowToRecord]: {
			name: 'Allow To Record',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/allowToRecord', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.allowToRecord,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.disallowToRecord]: {
			name: 'Disallow To Record',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/disallowToRecord', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.disallowToRecord,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.gotoNextGalleryPage]: {
			name: 'Goto Next Gallery Page',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/galleryPageNext')
				const sendToCommand = {
					id: ActionId.gotoNextGalleryPage,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				const sendToCommandFollowUp = {
					id: ActionId.requestOrderOfGalleryView,
					options: {
						command: '/zoom/getGalleryOrder',
						args: [],
					},
				}
				sendActionCommand(sendToCommand)
				sendActionCommand(sendToCommandFollowUp)
			},
		},
		[ActionId.gotoPreviousGalleryPage]: {
			name: 'Goto Previous Gallery Page',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/galleryPagePrev')
				const sendToCommand = {
					id: ActionId.gotoPreviousGalleryPage,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				const sendToCommandFollowUp = {
					id: ActionId.requestOrderOfGalleryView,
					options: {
						command: '/zoom/getGalleryOrder',
						args: [],
					},
				}
				sendActionCommand(sendToCommand)
				sendActionCommand(sendToCommandFollowUp)
			},
		},
		[ActionId.setSpeakerView]: {
			name: 'Set Speaker View',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/setSpeakerView')
				const sendToCommand = {
					id: ActionId.setSpeakerView,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.showNonVideoParticipants]: {
			name: 'Show Non Video Participants',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/showNonVideoParticipants')
				const sendToCommand = {
					id: ActionId.showNonVideoParticipants,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.hideNonVideoParticipants]: {
			name: 'Hide Non Video Participants',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/hideNonVideoParticipants')
				const sendToCommand = {
					id: ActionId.hideNonVideoParticipants,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.showUserNamesOnVideo]: {
			name: 'Show User Names On Video',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/showUserNames')
				const sendToCommand = {
					id: ActionId.showUserNamesOnVideo,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.hideUserNamesOnVideo]: {
			name: 'Hide User Names On Video',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/hideUserNames')
				const sendToCommand = {
					id: ActionId.hideUserNamesOnVideo,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.enableOriginalSound]: {
			name: 'Enable Original Sound',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/enableOriginalSound', action.options.userName, true)
				const sendToCommand = {
					id: ActionId.enableOriginalSound,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.disableOriginalSound]: {
			name: 'Disable Original Sound',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/disableOriginalSound', action.options.userName, true)
				const sendToCommand = {
					id: ActionId.disableOriginalSound,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.enableHDVideo]: {
			name: 'Enable HD Video',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/enableHDVideo')
				const sendToCommand = {
					id: ActionId.enableHDVideo,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.disableHDVideo]: {
			name: 'Disable HD Video',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/disableHDVideo')
				const sendToCommand = {
					id: ActionId.disableHDVideo,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.enableMirrorVideo]: {
			name: 'Enable Mirror Video',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/enableMirrorVideo', action.options.userName, true)
				const sendToCommand = {
					id: ActionId.enableMirrorVideo,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.disableMirrorVideo]: {
			name: 'Disable Mirror Video',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/disableMirrorVideo', action.options.userName, true)
				const sendToCommand = {
					id: ActionId.disableMirrorVideo,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.enableOptimizeVideoForSharing]: {
			name: 'Enable Optimize Video For Sharing',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/enableOptimizeVideo')
				const sendToCommand = {
					id: ActionId.enableOptimizeVideoForSharing,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.disableOptimizeVideoForSharing]: {
			name: 'Disable Optimize Video For Sharing',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/disableOptimizeVideo')
				const sendToCommand = {
					id: ActionId.disableOptimizeVideoForSharing,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.enableComputerSoundWhenSharing]: {
			name: 'Enable Computer Sound When Sharing',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/enableComputerSoundWhenSharing')
				const sendToCommand = {
					id: ActionId.enableComputerSoundWhenSharing,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.disableComputerSoundWhenSharing]: {
			name: 'Disable Computer Sound When Sharing',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/disableComputerSoundWhenSharing')
				const sendToCommand = {
					id: ActionId.disableComputerSoundWhenSharing,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.sendParticipantToBreakoutRoom]: {
			name: 'Send Participant To BreakoutRoom',
			options: [options.userName, options.breakoutName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/sendToBreakout', action.options.userName, select.multi)
				command.args.push({ type: 's', value: action.options.breakoutName as string })
				const sendToCommand = {
					id: ActionId.sendParticipantToBreakoutRoom,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.removeParticipantFromBreakoutRoom]: {
			name: 'Remove Participant From BreakoutRoom',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/removeFromBreakout', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.removeParticipantFromBreakoutRoom,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.assignParticipantToBreakoutRoom]: {
			name: 'Assign Participant To BreakoutRoom',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/assignToBreakout', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.assignParticipantToBreakoutRoom,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.unassignParticipantFromBreakoutRoom]: {
			name: 'Unassign Participant From BreakoutRoom',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/unassignFromBreakout', action.options.userName, select.multi)
				const sendToCommand = {
					id: ActionId.unassignParticipantFromBreakoutRoom,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setGalleryView]: {
			name: 'Set Gallery View',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/setGalleryView')
				const sendToCommand = {
					id: ActionId.setGalleryView,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.muteAll]: {
			name: 'Mute All',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/all/mute')
				const sendToCommand = {
					id: ActionId.muteAll,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.unmuteAll]: {
			name: 'Unmute All',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/all/unMute')
				const sendToCommand = {
					id: ActionId.unmuteAll,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.muteAllExcept]: {
			name: 'Mute All Except',
			options: [],
			callback: (): void => {
				// type: 'User'
				const command = createCommand('/Mute', '', false, true)
				const sendToCommand = {
					id: ActionId.muteAllExcept,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.clearSpotlight]: {
			name: 'Clear Spotlight',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/clearSpot')
				const sendToCommand = {
					id: ActionId.clearSpotlight,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.enableUsersToUnmute]: {
			name: 'Enable Users To Unmute',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/enableUsersUnmute')
				const sendToCommand = {
					id: ActionId.enableUsersToUnmute,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.disableUsersToUnmute]: {
			name: 'Disable Users ToUnmute',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/disableUsersUnmute')
				const sendToCommand = {
					id: ActionId.disableUsersToUnmute,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.lowerAllHands]: {
			name: 'Lower AllHands',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/lowerAllHands')
				const sendToCommand = {
					id: ActionId.lowerAllHands,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
				for (const key in instance.ZoomUserData) {
					if (Object.prototype.hasOwnProperty.call(instance.ZoomUserData, key)) {
						const user = instance.ZoomUserData[key]
						user.handRaised = false
					}
				}
				instance.checkFeedbacks(
					FeedbackId.galleryBased,
					FeedbackId.groupBased,
					FeedbackId.indexBased,
					FeedbackId.userNameBased
				)
			},
		},
		[ActionId.openBreakoutRooms]: {
			name: 'Open Breakout Rooms',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/openBreakouts')
				const sendToCommand = {
					id: ActionId.openBreakoutRooms,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.closeBreakoutRooms]: {
			name: 'Close Breakout Rooms',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/closeBreakouts')
				const sendToCommand = {
					id: ActionId.closeBreakoutRooms,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.deleteAllBreakoutRooms]: {
			name: 'Delete All Breakout Rooms',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/deleteAllBreakouts')
				const sendToCommand = {
					id: ActionId.deleteAllBreakoutRooms,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.admitEveryoneFromWaitingRoom]: {
			name: 'Admit All',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/admitAll')
				const sendToCommand = {
					id: ActionId.admitEveryoneFromWaitingRoom,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.ejectAll]: {
			name: 'Eject All Webinar Attendees',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/ejectAttendees')
				const sendToCommand = {
					id: ActionId.ejectAll,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.startLocalRecording]: {
			name: 'Start Local Recording',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/startLocalRecording')
				const sendToCommand = {
					id: ActionId.startLocalRecording,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.pauseLocalRecording]: {
			name: 'Pause Local Recording',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/pauseLocalRecording')
				const sendToCommand = {
					id: ActionId.pauseLocalRecording,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.resumeLocalRecording]: {
			name: 'Resume Local Recording',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/resumeLocalRecording')
				const sendToCommand = {
					id: ActionId.resumeLocalRecording,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.stopLocalRecording]: {
			name: 'Stop Local Recording',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/stopLocalRecording')
				const sendToCommand = {
					id: ActionId.stopLocalRecording,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.startCloudRecording]: {
			name: 'Start Cloud Recording',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/startCloudRecording')
				const sendToCommand = {
					id: ActionId.startCloudRecording,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.pauseCloudRecording]: {
			name: 'Pause Cloud Recording',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/pauseCloudRecording')
				const sendToCommand = {
					id: ActionId.pauseCloudRecording,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.resumeCloudRecording]: {
			name: 'Resume Cloud Recording',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/resumeCloudRecording')
				const sendToCommand = {
					id: ActionId.resumeCloudRecording,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.stopCloudRecording]: {
			name: 'Stop Cloud Recording',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/stopCloudRecording')
				const sendToCommand = {
					id: ActionId.stopCloudRecording,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.requestGalleryCount]: {
			name: 'Request GalleryCount',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/galCount')
				const sendToCommand = {
					id: ActionId.requestGalleryCount,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.requestListOfBreakoutRooms]: {
			name: 'Request list of breakout rooms',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/listBreakouts')
				const sendToCommand = {
					id: ActionId.requestListOfBreakoutRooms,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.leaveMeeting]: {
			name: 'Leave Meeting',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/leaveMeeting')
				const sendToCommand = {
					id: ActionId.leaveMeeting,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.endMeeting]: {
			name: 'End Meeting',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/endMeeting')
				const sendToCommand = {
					id: ActionId.endMeeting,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.enableWaitingRoom]: {
			name: 'Enable Waiting Room',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/enableWaitingRoom')
				const sendToCommand = {
					id: ActionId.enableWaitingRoom,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.disableWaitingRoom]: {
			name: 'Disable Waiting Room',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/disableWaitingRoom')
				const sendToCommand = {
					id: ActionId.disableWaitingRoom,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.pingZoomOSC]: {
			name: 'Ping Zoom OSC',
			options: [],
			callback: (): void => {
				// type: 'Special'
				const command = createCommand('/ping')
				const sendToCommand = {
					id: ActionId.pingZoomOSC,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.requestOrderOfGalleryView]: {
			name: 'Request Order Of GalleryView',
			options: [],
			callback: (): void => {
				// type: 'Special'
				const command = createCommand('/getGalleryOrder')
				const sendToCommand = {
					id: ActionId.requestOrderOfGalleryView,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.listUsers]: {
			name: 'Request list of Participants',
			options: [],
			callback: (): void => {
				// type: 'Special'
				const command = createCommand('/list')
				const sendToCommand = {
					id: ActionId.listUsers,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.startCameraShare]: {
			name: 'Start CameraShare',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand('/me/startCameraShare')
				const sendToCommand = {
					id: ActionId.startCameraShare,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.configureBreakoutRooms]: {
			name: 'Configure BreakoutRooms',
			options: [
				options.postCloseSeconds,
				options.allowChooseBreakout,
				options.allowReturnAtWill,
				options.autoMoveParticipants,
				options.useTimer,
				options.closeWithTimer,
				options.breakoutDurrationSeconds,
			],
			callback: (action): void => {
				// type: 'Special'
				const command = createCommand('/configureBreakouts')
				command.args.push({ type: 'i', value: action.options.postCloseSeconds })
				command.args.push({ type: 'i', value: action.options.allowChooseBreakout })
				command.args.push({ type: 'i', value: action.options.allowReturnAtWill })
				command.args.push({ type: 'i', value: action.options.autoMoveParticipants })
				command.args.push({ type: 'i', value: action.options.useTimer })
				command.args.push({ type: 'i', value: action.options.closeWithTimer })
				command.args.push({ type: 'i', value: action.options.breakoutDurrationSeconds })
				const sendToCommand = {
					id: ActionId.configureBreakoutRooms,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		// [ActionId.rename]: {
		// 	name: 'Rename',
		// 	options: [
		// 		options.userName,
		// 		options.name,
		// 	],
		// 	callback: (action): void => {
		// 		// type: 'User'
		// 		let command = createCommand('/rename', action.options.userName, select.single)
		// 		command.args.push({ type: 'i', value: action.options.name})
		// 		const sendToCommand = {
		// 			id: ActionId.rename,
		// 			options: {
		// 				command: command.oscPath,
		// 				args: command.args,
		// 			},
		// 		}
		// 		sendActionCommand(sendToCommand)
		// 	},
		// },

		[ActionId.SetWindowPosition]: {
			name: 'Set Window Position',
			options: [options.userName, options.intX, options.intY],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/setWindowPosition', action.options.userName, select.single)
				command.args.push({ type: 'i', value: action.options.intX })
				command.args.push({ type: 'i', value: action.options.intY })
				const sendToCommand = {
					id: ActionId.SetWindowPosition,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.SetWindowSize]: {
			name: 'Set Window Size',
			options: [options.userName, options.intX, options.intY],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/setWindowSize', action.options.userName, select.single)
				command.args.push({ type: 'i', value: action.options.intX })
				command.args.push({ type: 'i', value: action.options.intY })
				const sendToCommand = {
					id: ActionId.SetWindowSize,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setVirtualBackground]: {
			name: 'Set Virtual Background',
			options: [options.userName, options.id],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/setBackground', action.options.userName, select.single)
				command.args.push({ type: 'i', value: action.options.id })
				const sendToCommand = {
					id: ActionId.setVirtualBackground,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setVideoFilter]: {
			name: 'Set Video Filter',
			options: [options.userName, options.id],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/setVideoFilter', action.options.userName, select.single)
				command.args.push({ type: 'i', value: action.options.id })
				const sendToCommand = {
					id: ActionId.setVideoFilter,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setCameraDevice]: {
			name: 'Set Camera Device',
			options: [options.userName, options.id],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/setCameraDevice', action.options.userName, select.single)
				command.args.push({ type: 'i', value: action.options.id })
				const sendToCommand = {
					id: ActionId.setCameraDevice,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setSpeakerVolume]: {
			name: 'Set Speaker Volume',
			options: [options.userName, options.level],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/setSpeakerVolume', action.options.userName, select.multi)
				command.args.push({ type: 'i', value: action.options.level })
				const sendToCommand = {
					id: ActionId.setSpeakerVolume,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setSpeakerDevice]: {
			name: 'Set Speaker Device',
			options: [options.userName, options.id],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/setSpeakerDevice', action.options.userName, select.single)
				command.args.push({ type: 'i', value: action.options.id })
				const sendToCommand = {
					id: ActionId.setSpeakerDevice,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setMicDevice]: {
			name: 'Set Mic Device',
			options: [options.userName, options.id],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/setMicDevice', action.options.userName, select.single)
				command.args.push({ type: 'i', value: action.options.id })
				const sendToCommand = {
					id: ActionId.setMicDevice,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.setMicLevel]: {
			name: 'Set Mic Level',
			options: [options.level],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/setMicLevel')
				command.args.push({ type: 'i', value: action.options.level })
				const sendToCommand = {
					id: ActionId.setMicLevel,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.startShareWithWindow]: {
			name: 'Share Window',
			options: [options.id],
			callback: (action): void => {
				// type: 'Global'
				const command = createCommand('/me/startWindowShare')
				command.args.push({ type: 'i', value: action.options.id })
				const sendToCommand = {
					id: ActionId.startShareWithWindow,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.startAudioShare]: {
			name: 'Start AudioShare',
			options: [options.id],
			callback: (action): void => {
				// type: 'Global'
				const command = createCommand('/me/startAudioShare')
				command.args.push({ type: 'i', value: action.options.id })
				const sendToCommand = {
					id: ActionId.startAudioShare,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.startScreenShare]: {
			name: 'Screen Share',
			options: [options.id],
			callback: (action): void => {
				// type: 'Global'
				const command = createCommand('/me/startScreenShare')
				command.args.push({ type: 'i', value: action.options.id })
				const sendToCommand = {
					id: ActionId.startScreenShare,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.sendAChatViaDM]: {
			name: 'Chat Via DM',
			options: [options.userName, options.message],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand('/chat', action.options.userName, select.multi)
				command.args.push({ type: 's', value: action.options.message })
				const sendToCommand = {
					id: ActionId.sendAChatViaDM,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.sendAChatToEveryone]: {
			name: 'Send A Chat To Everyone',
			options: [options.message],
			callback: (action): void => {
				// type: 'Global'
				const command = createCommand('/chatAll')
				command.args.push({ type: 's', value: action.options.message })
				const sendToCommand = {
					id: ActionId.sendAChatToEveryone,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.createBreakoutRoom]: {
			name: 'Create Breakout Room',
			options: [options.name],
			callback: (action): void => {
				// type: 'Global'
				const command = createCommand('/createBreakout')
				command.args.push({ type: 's', value: action.options.name })
				const sendToCommand = {
					id: ActionId.createBreakoutRoom,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.deleteBreakoutRoom]: {
			name: 'Delete Breakout Room',
			options: [options.name],
			callback: (action): void => {
				// type: 'Global'
				const command = createCommand('/deleteBreakout')
				command.args.push({ type: 's', value: action.options.name })
				const sendToCommand = {
					id: ActionId.deleteBreakoutRoom,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.broadcastMessageToBreakoutRooms]: {
			name: 'Broadcast Message To Breakout Rooms',
			options: [options.message],
			callback: (action): void => {
				// type: 'Global'
				const command = createCommand('/broadcastToBreakouts')
				command.args.push({ type: 's', value: action.options.message })
				const sendToCommand = {
					id: ActionId.broadcastMessageToBreakoutRooms,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.sendMessageToWaitingRoom]: {
			name: 'Send Message To Waiting Room',
			options: [options.message],
			callback: (action): void => {
				// type: 'Global'
				const command = createCommand('/messageWaitingRoom')
				command.args.push({ type: 's', value: action.options.message })
				const sendToCommand = {
					id: ActionId.sendMessageToWaitingRoom,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.joinMeeting]: {
			name: 'Join Meeting',
			options: [options.meetingID, options.password, options.name],
			callback: (action): void => {
				// type: 'Special'
				const command = createCommand('/joinMeeting')
				command.args.push({ type: 's', value: action.options.meetingID })
				command.args.push({ type: 's', value: action.options.password })
				command.args.push({ type: 's', value: action.options.name })
				const sendToCommand = {
					id: ActionId.joinMeeting,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.ZAKJoinMeeting]: {
			name: 'ZAK Join Meeting',
			options: [options.zak, options.meetingID, options.name],
			callback: (action): void => {
				// type: 'Special'
				const command = createCommand('/zakJoin')
				command.args.push({ type: 's', value: action.options.zak })
				command.args.push({ type: 's', value: action.options.meetingID })
				command.args.push({ type: 's', value: action.options.name })
				const sendToCommand = {
					id: ActionId.ZAKJoinMeeting,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.ZAKStartMeeting]: {
			name: 'ZAK Start Meeting',
			options: [options.zak, options.meetingID, options.name],
			callback: (action): void => {
				// type: 'Special'
				const command = createCommand('/zakStart')
				command.args.push({ type: 's', value: action.options.zak })
				command.args.push({ type: 's', value: action.options.meetingID })
				command.args.push({ type: 's', value: action.options.name })
				const sendToCommand = {
					id: ActionId.ZAKStartMeeting,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.customCommand]: {
			name: 'Custom command',
			options: [options.path],
			callback: (action): void => {
				// type: 'Special'
				const command = createCommand(action.options.path as string)
				const sendToCommand = {
					id: ActionId.customCommand,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
		[ActionId.customCommandWithArguments]: {
			name: 'Custom w/args',
			options: [options.path, options.customArgs],
			callback: (action): void => {
				// type: 'Special'
				const command = createCommand(action.options.path as string)
				command.args.push(JSON.parse(action.options.customArgs as string))
				const sendToCommand = {
					id: ActionId.customCommandWithArguments,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(sendToCommand)
			},
		},
	}

	/**
	 * createUserCommand function to create oscPath and arguments for user
	 * @param actionID string
	 * @param name string
	 * @returns object { argsCallers: { type: string; value: string | number }[]; oscPath: string }
	 */
	const createCommand = (
		OSCAction: string,
		name?: InputValue | string | undefined,
		singleUser?: boolean | null,
		allExcept?: boolean | null
	) => {
		const command: {
			args: { type: string; value: any }[]
			oscPath: string
			oscPathName: string
		} = {
			args: [],
			oscPath: '',
			oscPathName: '',
		}
		// If/When no user is involved set path and skip the rest
		if (singleUser === null || singleUser === undefined) {
			command.oscPath = `/zoom${OSCAction}`
		} else {
			const selectedCallers: number[] | string = instance.ZoomClientDataObj.selectedCallers
			// Check if override has been filled
			if (name != '' && name != undefined) {
				instance.log('debug', 'Override:' + name)
				const value = instance.getVariableValue(name as string)
				instance.log('debug', 'Value of getVariable:' + value)
				if (value !== undefined || '') name = value?.toString()

				if (name === 'Me' || name === 'me' || name === 'all' || name === 'All') {
					command.oscPath = `/zoom/${name.toLowerCase()}` + OSCAction
				} else {
					command.oscPath = `/zoom/userName` + OSCAction
					command.args.push({ type: 's', value: name })
				}
				// Use the pre-selection options
			} else {
				if (Array.isArray(selectedCallers)) {
					// should be otherwise somethings wrong
					if (selectedCallers.length === 0) {
						console.log('Select a caller first')
						// return something to prevent users from sending a command
					}
					// When command is for one user only send first caller
					if (singleUser) {
						command.args.push({ type: 'i', value: selectedCallers[0] })
					} else {
						selectedCallers.forEach((caller) => {
							command.args.push({ type: 'i', value: caller })
						})
					}
				} else {
					instance.log('debug', 'Wrong selection, no array')
				}
				// Different path when more than one users are selected
				if (allExcept) {
					command.oscPath =
						(command.args.length > 1 ? `/zoom/allExcept/users/zoomID` : `/zoom/allExecpt/zoomID`) + OSCAction
				} else {
					command.oscPath = (command.args.length > 1 ? `/zoom/users/zoomID` : `/zoom/zoomID`) + OSCAction
				}
			}
		}
		return command
	}

	return actions
}
