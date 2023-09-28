import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config'
import { InstanceBaseExt, options } from '../utils'
import { createCommand, sendActionCommand } from './action-utils'

export enum ActionIdGlobalWaitingRoomsAndZak {
	disableWaitingRoom = 'disableWaitingRoom',
	enableWaitingRoom = 'enableWaitingRoom',
	sendMessageToWaitingRoom = 'sendMessageToWaitingRoom',
	admitEveryoneFromWaitingRoom = 'admitEveryoneFromWaitingRoom',
	ZAKStartMeeting = 'ZAKStartMeeting',
	ZAKJoinMeeting = 'ZAKJoinMeeting',
}

export function GetActionsGlobalWaitingRoomsAndZak(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdGlobalWaitingRoomsAndZak]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdGlobalWaitingRoomsAndZak]: CompanionActionDefinition | undefined } = {
		[ActionIdGlobalWaitingRoomsAndZak.admitEveryoneFromWaitingRoom]: {
			name: 'Admit All (PRO)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/admitAll')
				const sendToCommand = {
					id: ActionIdGlobalWaitingRoomsAndZak.admitEveryoneFromWaitingRoom,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalWaitingRoomsAndZak.enableWaitingRoom]: {
			name: 'Enable Waiting Room (PRO)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/enableWaitingRoom')
				const sendToCommand = {
					id: ActionIdGlobalWaitingRoomsAndZak.enableWaitingRoom,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalWaitingRoomsAndZak.disableWaitingRoom]: {
			name: 'Disable Waiting Room (PRO)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/disableWaitingRoom')
				const sendToCommand = {
					id: ActionIdGlobalWaitingRoomsAndZak.disableWaitingRoom,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalWaitingRoomsAndZak.sendMessageToWaitingRoom]: {
			name: 'Send Message To Waiting Room (PRO)',
			options: [options.message],
			callback: (action): void => {
				// type: 'Global'
				const command = createCommand(instance, '/messageWaitingRoom')
				command.args.push({ type: 's', value: action.options.message })
				const sendToCommand = {
					id: ActionIdGlobalWaitingRoomsAndZak.sendMessageToWaitingRoom,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalWaitingRoomsAndZak.ZAKJoinMeeting]: {
			name: 'ZAK Join Meeting (PRO)',
			options: [options.zak, options.meetingID, options.name],
			callback: async (action): Promise<void> => {
				// type: 'Special'
				const command = createCommand(instance, '/zakJoin')
				const newName = await instance.parseVariablesInString(action.options.name as string)
				command.args.push({ type: 's', value: action.options.zak })
				command.args.push({ type: 's', value: action.options.meetingID })
				command.args.push({ type: 's', value: newName })
				const sendToCommand = {
					id: ActionIdGlobalWaitingRoomsAndZak.ZAKJoinMeeting,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalWaitingRoomsAndZak.ZAKStartMeeting]: {
			name: 'ZAK Start Meeting (PRO)',
			options: [options.zak, options.meetingID, options.name],
			callback: async (action): Promise<void> => {
				// type: 'Special'
				const command = createCommand(instance, '/zakStart')
				const newName = await instance.parseVariablesInString(action.options.name as string)
				command.args.push({ type: 's', value: action.options.zak })
				command.args.push({ type: 's', value: action.options.meetingID })
				command.args.push({ type: 's', value: newName })
				const sendToCommand = {
					id: ActionIdGlobalWaitingRoomsAndZak.ZAKStartMeeting,
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
