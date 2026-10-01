import type ModuleInstance from '../index.js'
import type { CompanionActionDefinitions } from '@companion-module/base'
import { options } from '../utils.js'
import { createCommand, select, sendActionCommand } from './action-utils.js'

export enum ActionIdUserHandRaised {
	raiseHand = 'raiseHand',
	lowerHand = 'lowerHand',
	toggleHand = 'toggleHand',
}

export type ActionsSchemaUserHandRaised = {
	[ActionIdUserHandRaised.raiseHand]: { options: { userName: string } }
	[ActionIdUserHandRaised.lowerHand]: { options: { userName: string } }
	[ActionIdUserHandRaised.toggleHand]: { options: { userName: string } }
}

export function GetActionsUserHandRaised(
	instance: ModuleInstance,
): CompanionActionDefinitions<ActionsSchemaUserHandRaised> {
	const actions: CompanionActionDefinitions<ActionsSchemaUserHandRaised> = {
		[ActionIdUserHandRaised.raiseHand]: {
			name: 'Raise Hand',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const command = createCommand(instance, '/raiseHand', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserHandRaised.raiseHand,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserHandRaised.lowerHand]: {
			name: 'Lower Hand',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const command = createCommand(instance, '/lowerHand', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserHandRaised.lowerHand,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserHandRaised.toggleHand]: {
			name: 'Toggle Hand (Windows Only)',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const command = createCommand(instance, '/toggleHand', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserHandRaised.toggleHand,
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
