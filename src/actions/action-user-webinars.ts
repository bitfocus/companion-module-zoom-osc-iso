import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config'
import { InstanceBaseExt, options } from '../utils'
import { createCommand, select, sendActionCommand } from './action-utils'

export enum ActionIdUserWebinar {
	allowWebinarAttendeeToSpeak = 'allowWebinarAttendeeToSpeak',
	disallowToSpeak = 'disallowToSpeak',
}

export function GetActionsUserWebinar(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdUserWebinar]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdUserWebinar]: CompanionActionDefinition | undefined } = {
		[ActionIdUserWebinar.allowWebinarAttendeeToSpeak]: {
			name: 'Allow to Speak',
			options: [options.userName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
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
			name: 'Disallow to Speak',
			options: [options.userName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
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
