import type ModuleInstance from '../index.js'
import type { CompanionActionDefinitions } from '@companion-module/base'
import { options } from '../utils.js'
import { createCommand, select, sendActionCommand } from './action-utils.js'

export enum ActionIdUserWaitingRoom {
	admitSomeoneFromWaitingRoom = 'admitSomeoneFromWaitingRoom',
	sendSomeoneToWaitingRoom = 'sendSomeoneToWaitingRoom',
}

export type ActionsSchemaUserWaitingRoom = {
	[ActionIdUserWaitingRoom.admitSomeoneFromWaitingRoom]: { options: { userName: string } }
	[ActionIdUserWaitingRoom.sendSomeoneToWaitingRoom]: { options: { userName: string } }
}

export function GetActionsUserWaitingRoom(
	instance: ModuleInstance,
): CompanionActionDefinitions<ActionsSchemaUserWaitingRoom> {
	const actions: CompanionActionDefinitions<ActionsSchemaUserWaitingRoom> = {
		[ActionIdUserWaitingRoom.admitSomeoneFromWaitingRoom]: {
			name: 'Admit Participant (PRO)',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const command = createCommand(instance, '/admit', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserWaitingRoom.admitSomeoneFromWaitingRoom,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserWaitingRoom.sendSomeoneToWaitingRoom]: {
			name: 'Send To Waiting Room (PRO)',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const command = createCommand(instance, '/sendToWaitingRoom', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserWaitingRoom.sendSomeoneToWaitingRoom,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
	}

	return actions
}
