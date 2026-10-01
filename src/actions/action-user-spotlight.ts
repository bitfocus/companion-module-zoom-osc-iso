import type ModuleInstance from '../index.js'
import type { CompanionActionDefinitions } from '@companion-module/base'
import { options } from '../utils.js'
import { createCommand, select, sendActionCommand } from './action-utils.js'

export enum ActionIdUserSpotlight {
	spotLight = 'spotLight',
	addSpotlight = 'addSpotlight',
	unSpotLight = 'unSpotLight',
	toggleSpotlight = 'toggleSpotlight',
}

export type ActionsSchemaUserSpotlight = {
	[ActionIdUserSpotlight.spotLight]: { options: { userName: string } }
	[ActionIdUserSpotlight.addSpotlight]: { options: { userName: string } }
	[ActionIdUserSpotlight.unSpotLight]: { options: { userName: string } }
	[ActionIdUserSpotlight.toggleSpotlight]: { options: { userName: string } }
}

export function GetActionsUserSpotlight(
	instance: ModuleInstance,
): CompanionActionDefinitions<ActionsSchemaUserSpotlight> {
	const actions: CompanionActionDefinitions<ActionsSchemaUserSpotlight> = {
		[ActionIdUserSpotlight.spotLight]: {
			name: 'Single Spotlight',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
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
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
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
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
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
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
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
