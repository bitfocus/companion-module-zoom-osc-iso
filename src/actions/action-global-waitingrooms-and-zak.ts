import type ModuleInstance from '../index.js'
import type { CompanionActionDefinitions } from '@companion-module/base'
import { options } from '../utils.js'
import { createCommand, sendActionCommand } from './action-utils.js'

export enum ActionIdGlobalWaitingRoomsAndZak {
	enableWaitingRoom = 'enableWaitingRoom',
	disableWaitingRoom = 'disableWaitingRoom',
	sendMessageToWaitingRoom = 'sendMessageToWaitingRoom',
	admitEveryoneFromWaitingRoom = 'admitEveryoneFromWaitingRoom',
	ZAKStartMeeting = 'ZAKStartMeeting',
	ZAKJoinMeeting = 'ZAKJoinMeeting',
}

export type ActionsSchemaGlobalWaitingRoomsAndZak = {
	[ActionIdGlobalWaitingRoomsAndZak.admitEveryoneFromWaitingRoom]: { options: Record<string, never> }
	[ActionIdGlobalWaitingRoomsAndZak.enableWaitingRoom]: { options: Record<string, never> }
	[ActionIdGlobalWaitingRoomsAndZak.disableWaitingRoom]: { options: Record<string, never> }
	[ActionIdGlobalWaitingRoomsAndZak.sendMessageToWaitingRoom]: { options: { message: string } }
	[ActionIdGlobalWaitingRoomsAndZak.ZAKJoinMeeting]: { options: { zak: string; meetingID: string; name: string } }
	[ActionIdGlobalWaitingRoomsAndZak.ZAKStartMeeting]: { options: { zak: string; meetingID: string; name: string } }
}

export function GetActionsGlobalWaitingRoomsAndZak(
	instance: ModuleInstance,
): CompanionActionDefinitions<ActionsSchemaGlobalWaitingRoomsAndZak> {
	const actions: CompanionActionDefinitions<ActionsSchemaGlobalWaitingRoomsAndZak> = {
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
			callback: (action): void => {
				// type: 'Special'
				const command = createCommand(instance, '/zakJoin')
				const newName = action.options.name
				const zak = action.options.zak
				const meetingId = action.options.meetingID
				command.args.push({ type: 's', value: zak })
				command.args.push({ type: 's', value: meetingId })
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
			callback: (action): void => {
				// type: 'Special'
				const command = createCommand(instance, '/zakStart')
				const newName = action.options.name
				const zak = action.options.zak
				const meetingId = action.options.meetingID
				command.args.push({ type: 's', value: zak })
				command.args.push({ type: 's', value: meetingId })
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
