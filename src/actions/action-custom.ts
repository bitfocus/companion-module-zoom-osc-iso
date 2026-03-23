import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt, options } from '../utils.js'
import { createCommand, sendActionCommand } from './action-utils.js'

export enum ActionIdCustom {
	customCommand = 'customCommand',
	customCommandWithArguments = 'customCommandWithArguments',
}

export function GetActionsCustom(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdCustom]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdCustom]: CompanionActionDefinition | undefined } = {
		[ActionIdCustom.customCommand]: {
			name: 'Custom command',
			options: [options.path],
			callback: async (action): Promise<void> => {
				// type: 'Special'
				const customPath = await instance.parseVariablesInString(action.options.path as string)
				// Did they try a JSON object?
				if (customPath.startsWith('{')) {
					try {
						const convertedString = JSON.parse(customPath)
						const command = createCommand(instance, convertedString)
						const sendToCommand = {
							id: ActionIdCustom.customCommand,
							options: {
								command: command.oscPath,
								args: command.args,
							},
						}
						sendActionCommand(instance, sendToCommand)
					} catch (error) {
						instance.log('error', `$Not a JSON value, ${customPath}. Error: ${error}`)
					}
				} else {
					const command = createCommand(instance, customPath)
					const sendToCommand = {
						id: ActionIdCustom.customCommand,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdCustom.customCommandWithArguments]: {
			name: 'Custom w/args',
			options: [options.path, options.customArgs],
			callback: (action): void => {
				// type: 'Special'
				const command = createCommand(instance, action.options.path as string)
				command.args.push(JSON.parse(action.options.customArgs as string))
				const sendToCommand = {
					id: ActionIdCustom.customCommandWithArguments,
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
