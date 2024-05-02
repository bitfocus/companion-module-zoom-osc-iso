import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt, options } from '../utils.js'
import { createCommand, select, sendActionCommand } from './action-utils.js'

export enum ActionIdUserHandRaised {
	raiseHand = 'raiseHand',
	lowerHand = 'lowerHand',
	toggleHand = 'toggleHand',
}

export function GetActionsUserHandRaised(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdUserHandRaised]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdUserHandRaised]: CompanionActionDefinition | undefined } = {
		[ActionIdUserHandRaised.raiseHand]: {
			name: 'Raise Hand',
			options: [options.userName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
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
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
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
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
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
