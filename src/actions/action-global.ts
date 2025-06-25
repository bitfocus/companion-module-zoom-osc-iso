import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt, options } from '../utils.js'
import { FeedbackId } from '../feedback.js'
import {
	createCommand,
	sendActionCommand,
	select,
	PreviousSelectedCallersSave,
	PreviousSelectedCallersRestore,
} from './action-utils.js'

export enum ActionIdGlobal {
	enableUsersToUnmute = 'enableUsersToUnmute',
	disableUsersToUnmute = 'disableUsersToUnmute',
	muteAll = 'muteAll',
	unmuteAll = 'unmuteAll',
	lowerAllHands = 'lowerAllHands',
	clearSpotlight = 'clearSpotlight',
	pingZoomOSC = 'pingZoomOSC',
	startMeetng = 'startMeeting',
	joinMeeting = 'joinMeeting',
	leaveMeeting = 'leaveMeeting',
	endMeeting = 'endMeeting',
	sendAChatToEveryone = 'sendAChatToEveryone',
	ejectAll = 'ejectAll',
	// get webinar reaction count
	// reset webinar reaction counters
	updateActionFeedbackPresets = 'updateActionFeedbackPresets',
	muteAllExcept = 'muteAllExcept',
	muteAllExceptHost = 'muteAllExceptHost',
	muteAllExceptSpot = 'muteAllExceptSpotlight',
}

export function GetActionsGlobal(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdGlobal]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdGlobal]: CompanionActionDefinition | undefined } = {
		[ActionIdGlobal.enableUsersToUnmute]: {
			name: 'Enable Users To Unmute',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/enableUsersUnmute')
				const sendToCommand = {
					id: ActionIdGlobal.enableUsersToUnmute,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobal.disableUsersToUnmute]: {
			name: 'Disable Users ToUnmute',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/disableUsersUnmute')
				const sendToCommand = {
					id: ActionIdGlobal.disableUsersToUnmute,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobal.muteAll]: {
			name: 'Mute All Except Host but Mute Co-Host',
			options: [],
			callback: (): void => {
				// const command = createCommand(instance, '/all/mute')

				// hack because the /all/mute command mutes everyone except the
				// ZoomISO host even when they are the co-host
				// so we find the host and pass that to the /Mute command
				const host = Object.values(instance.ZoomUserData).find((user) => user.userRole === 1)

				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.ZoomClientDataObj.selectedCallers.push(host.zoomId)
				const shouldSavePreviousCaller = false
				const command = createCommand(instance, '/Mute', undefined, select.multi, true, shouldSavePreviousCaller)

				const sendToCommand = {
					id: ActionIdGlobal.muteAll,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobal.unmuteAll]: {
			name: 'Unmute All',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/all/unMute')
				const sendToCommand = {
					id: ActionIdGlobal.unmuteAll,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobal.lowerAllHands]: {
			name: 'Lower AllHands',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/lowerAllHands')
				const sendToCommand = {
					id: ActionIdGlobal.lowerAllHands,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobal.clearSpotlight]: {
			name: 'Clear Spotlight (PRO)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/clearSpot')
				const sendToCommand = {
					id: ActionIdGlobal.clearSpotlight,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobal.pingZoomOSC]: {
			name: 'Ping Zoom OSC',
			options: [],
			callback: (): void => {
				// type: 'Special'
				const command = createCommand(instance, '/ping')
				const sendToCommand = {
					id: ActionIdGlobal.pingZoomOSC,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobal.startMeetng]: {
			name: 'Start Meeting (PRO)',
			options: [options.meetingID, options.password, options.name],
			callback: async (action): Promise<void> => {
				// type: 'Special'
				const command = createCommand(instance, '/startMeeting')
				const name = await instance.parseVariablesInString(action.options.name as string)
				const meetingId = await instance.parseVariablesInString(action.options.meetingID as string)
				const password = await instance.parseVariablesInString(action.options.password as string)
				command.args.push({ type: 's', value: meetingId })
				command.args.push({ type: 's', value: password })
				command.args.push({ type: 's', value: name })
				const sendToCommand = {
					id: ActionIdGlobal.startMeetng,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobal.joinMeeting]: {
			name: 'Join Meeting (PRO)',
			options: [options.meetingID, options.password, options.name],
			callback: async (action): Promise<void> => {
				// type: 'Special'
				const command = createCommand(instance, '/joinMeeting')
				const newName = await instance.parseVariablesInString(action.options.name as string)
				const newNMeetingId = await instance.parseVariablesInString(action.options.meetingID as string)
				const newNPassword = await instance.parseVariablesInString(action.options.password as string)
				command.args.push({ type: 's', value: newNMeetingId })
				command.args.push({ type: 's', value: newNPassword })
				command.args.push({ type: 's', value: newName })
				const sendToCommand = {
					id: ActionIdGlobal.joinMeeting,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobal.leaveMeeting]: {
			name: 'Leave Meeting (PRO)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/leaveMeeting')
				const sendToCommand = {
					id: ActionIdGlobal.leaveMeeting,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobal.endMeeting]: {
			name: 'End Meeting (PRO)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/endMeeting')
				const sendToCommand = {
					id: ActionIdGlobal.endMeeting,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobal.sendAChatToEveryone]: {
			name: 'Send A Chat To Everyone',
			options: [options.message],
			callback: async (action): Promise<void> => {
				// type: 'Global'
				const command = createCommand(instance, '/chatAll')
				const message = await instance.parseVariablesInString(action.options.message as string)
				command.args.push({ type: 's', value: message.replaceAll('\\n', '\n') })
				const sendToCommand = {
					id: ActionIdGlobal.sendAChatToEveryone,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobal.ejectAll]: {
			name: 'Eject All Webinar Attendees',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/ejectAttendees')
				const sendToCommand = {
					id: ActionIdGlobal.ejectAll,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobal.muteAllExcept]: {
			name: 'Mute All Except',
			options: [options.userName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/Mute', userName, select.multi, true)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdGlobal.muteAllExcept,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdGlobal.muteAllExceptHost]: {
			name: 'Mute All Except Host Group',
			description: 'This will mute all but the ones in Group Hosts',
			options: [],
			callback: async (): Promise<void> => {
				PreviousSelectedCallersSave(instance)
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.ZoomGroupData[0].users.forEach((ZoomID) => {
					instance.ZoomClientDataObj.selectedCallers.push(ZoomID.zoomID)
				})

				const shouldSavePreviousCaller = false
				const command = createCommand(instance, '/Mute', undefined, select.multi, true, shouldSavePreviousCaller)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdGlobal.muteAllExceptHost,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}

				PreviousSelectedCallersRestore(instance)
			},
		},
		[ActionIdGlobal.muteAllExceptSpot]: {
			name: 'Mute All Except Spotlight Group',
			description: 'This will mute all but the ones in Group Spotlights',
			options: [],
			callback: async (): Promise<void> => {
				PreviousSelectedCallersSave(instance)
				instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.ZoomGroupData[1].users.forEach((ZoomID) => {
					instance.ZoomClientDataObj.selectedCallers.push(ZoomID.zoomID)
				})

				const shouldSavePreviousCaller = false
				const command = createCommand(instance, '/Mute', undefined, select.multi, true, shouldSavePreviousCaller)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdGlobal.muteAllExceptSpot,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}

				PreviousSelectedCallersRestore(instance)
			},
		},
		[ActionIdGlobal.updateActionFeedbackPresets]: {
			name: 'Update Actions/Feedbacks/Presets with current Zoom Data',
			options: [],
			callback: (): void => {
				// instance.log('debug', `before outputData: ${JSON.stringify(instance.ZoomOutputData)}`)

				instance.updateInstance()
				// instance.updateDefinitionsForActionsFeedbacksAndPresets()
				// Make sure initial status is reflected
				instance.checkFeedbacks(
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
				// instance.log('debug', `after outputData: ${JSON.stringify(instance.ZoomOutputData)}`)
			},
		},
	}

	return actions
}
