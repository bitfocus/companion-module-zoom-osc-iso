import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt, options } from '../utils.js'
import { createCommand, select, sendActionCommand } from './action-utils.js'

export enum ActionIdUserWaitingRoom {
	admitSomeoneFromWaitingRoom = 'admitSomeoneFromWaitingRoom',
	sendSomeoneToWaitingRoom = 'sendSomeoneToWaitingRoom',
}

export function GetActionsUserWaitingRoom(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdUserWaitingRoom]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdUserWaitingRoom]: CompanionActionDefinition | undefined } = {
		[ActionIdUserWaitingRoom.admitSomeoneFromWaitingRoom]: {
			name: 'Admit Participant (PRO)',
			options: [options.userName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
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
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
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
