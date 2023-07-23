import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config'
import { InstanceBaseExt, options, userExist } from '../utils'
import { FeedbackId } from '../feedback'
import { createCommand, sendActionCommand, select, PreviousSelectedCallersSave } from './action-utils'

export enum ActionIdGlobal {
	enableUsersToUnmute = 'enableUsersToUnmute',
	disableUsersToUnmute = 'disableUsersToUnmute',
	muteAll = 'muteAll',
	unmuteAll = 'unmuteAll',
	muteAllExcept = 'muteAllExcept',
	muteAllExceptHost = 'muteAllExceptHost',
	clearSpotlight = 'clearSpotlight',
	lowerAllHands = 'lowerAllHands',
	endMeeting = 'endMeeting',
	joinMeeting = 'joinMeeting',
	leaveMeeting = 'leaveMeeting',
	pingZoomOSC = 'pingZoomOSC',
	sendAChatToEveryone = 'sendAChatToEveryone',
	ejectAll = 'ejectAll',
}

export function GetActionsGlobal(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdGlobal]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdGlobal]: CompanionActionDefinition | undefined } = {
		[ActionIdGlobal.muteAll]: {
			name: 'Mute All',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/all/mute')
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
			name: 'Mute All Except Host',
			description: 'This will mute all but the ones in Group Hosts',
			options: [],
			callback: async (): Promise<void> => {
				PreviousSelectedCallersSave(instance)
				// instance.ZoomClientDataObj.selectedCallers.length = 0
				instance.ZoomGroupData[0].users.forEach((ZoomID) => {
					instance.ZoomClientDataObj.selectedCallers.push(ZoomID.zoomID)
				})

				const command = createCommand(instance, '/Mute', undefined, select.multi, true)
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
			},
		},
		[ActionIdGlobal.clearSpotlight]: {
			name: 'Clear Spotlight',
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
				for (const key in instance.ZoomUserData) {
					if (userExist(Number(key), instance.ZoomUserData)) {
						instance.ZoomUserData[key].handRaised = false
					}
				}
				instance.checkFeedbacks(
					FeedbackId.userNameBased,
					FeedbackId.userNameBasedAdvanced,
					FeedbackId.indexBased,
					FeedbackId.indexBasedAdvanced,
					FeedbackId.galleryBased,
					FeedbackId.galleryBasedAdvanced,
					FeedbackId.groupBased,
					FeedbackId.groupBasedAdvanced
				)
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
		[ActionIdGlobal.leaveMeeting]: {
			name: 'Leave Meeting',
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
			name: 'End Meeting',
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
		[ActionIdGlobal.sendAChatToEveryone]: {
			name: 'Send A Chat To Everyone',
			options: [options.message],
			callback: async (action): Promise<void> => {
				// type: 'Global'
				const command = createCommand(instance, '/chatAll')
				const message = await instance.parseVariablesInString(action.options.message as string)

				command.args.push({ type: 's', value: message })
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
		[ActionIdGlobal.joinMeeting]: {
			name: 'Join Meeting',
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
	}

	return actions
}
