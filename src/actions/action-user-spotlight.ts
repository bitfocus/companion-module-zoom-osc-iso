import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt, options } from '../utils.js'
import { createCommand, select, sendActionCommand } from './action-utils.js'

export enum ActionIdUserSpotlight {
	addSpotlight = 'addSpotlight',
	spotLight = 'spotLight',
	unSpotLight = 'unSpotLight',
	toggleSpotlight = 'toggleSpotlight',
}

export function GetActionsUserSpotlight(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdUserSpotlight]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdUserSpotlight]: CompanionActionDefinition | undefined } = {
		[ActionIdUserSpotlight.spotLight]: {
			name: 'Single Spotlight',
			options: [options.userName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/spot', userName, select.single)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserSpotlight.spotLight,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserSpotlight.addSpotlight]: {
			name: 'Add Spotlight (PRO)',
			options: [options.userName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/addSpot', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserSpotlight.addSpotlight,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserSpotlight.unSpotLight]: {
			name: 'Un Spotlight',
			options: [options.userName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/unSpot', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserSpotlight.unSpotLight,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserSpotlight.toggleSpotlight]: {
			name: 'Toggle Spotlight (PRO)',
			options: [options.userName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/toggleSpot', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserSpotlight.toggleSpotlight,
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
