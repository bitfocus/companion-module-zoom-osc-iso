import type ModuleInstance from '../index.js'
import type { CompanionActionDefinitions } from '@companion-module/base'
import { options } from '../utils.js'
import { createCommand, select, sendActionCommand } from './action-utils.js'

export enum ActionIdUserWebinar {
	allowWebinarAttendeeToSpeak = 'allowWebinarAttendeeToSpeak',
	disallowToSpeak = 'disallowToSpeak',
}

export type ActionsSchemaUserWebinar = {
	[ActionIdUserWebinar.allowWebinarAttendeeToSpeak]: { options: { userName: string } }
	[ActionIdUserWebinar.disallowToSpeak]: { options: { userName: string } }
}

export function GetActionsUserWebinar(instance: ModuleInstance): CompanionActionDefinitions<ActionsSchemaUserWebinar> {
	const actions: CompanionActionDefinitions<ActionsSchemaUserWebinar> = {
		[ActionIdUserWebinar.allowWebinarAttendeeToSpeak]: {
			name: 'Allow to Speak (PRO)',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const command = createCommand(instance, '/allowToSpeak', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserWebinar.allowWebinarAttendeeToSpeak,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserWebinar.disallowToSpeak]: {
			name: 'Disallow to Speak (PRO)',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const command = createCommand(instance, '/disallowToSpeak', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserWebinar.disallowToSpeak,
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
