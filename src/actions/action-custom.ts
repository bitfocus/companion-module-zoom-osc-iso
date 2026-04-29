import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt, options } from '../utils.js'
import { createCommand, sendActionCommand } from './action-utils.js'

type OscArgument = {
	type: string
	value: unknown
}

type CustomJsonCommand = {
	oscPath: string
	args?: OscArgument[]
}

function isOscArgument(value: unknown): value is OscArgument {
	return (
		typeof value === 'object' && value !== null && 'type' in value && 'value' in value && typeof value.type === 'string'
	)
}

function isCustomJsonCommand(value: unknown): value is CustomJsonCommand {
	return (
		typeof value === 'object' &&
		value !== null &&
		'oscPath' in value &&
		typeof value.oscPath === 'string' &&
		(!('args' in value) || (Array.isArray(value.args) && value.args.every(isOscArgument)))
	)
}

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
				const customPath = action.options.path as string
				// Did they try a JSON object?
				if (customPath.startsWith('{')) {
					try {
						const parsedCommand = JSON.parse(customPath) as unknown
						if (!isCustomJsonCommand(parsedCommand)) {
							instance.log('error', `Invalid JSON command shape: ${customPath}`)
							return
						}

						const sendToCommand = {
							id: ActionIdCustom.customCommand,
							options: {
								command: parsedCommand.oscPath,
								args: parsedCommand.args ?? [],
							},
						}
						sendActionCommand(instance, sendToCommand)
					} catch (error) {
						instance.log('error', `Not a JSON value, ${customPath}. Error: ${error}`)
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
				try {
					const parsedArgument = JSON.parse(action.options.customArgs as string) as unknown
					if (!isOscArgument(parsedArgument)) {
						instance.log('error', `Invalid custom argument shape: ${action.options.customArgs as string}`)
						return
					}

					command.args.push(parsedArgument)
				} catch (error) {
					instance.log('error', `Not a JSON value, ${action.options.customArgs as string}. Error: ${error}`)
					return
				}

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
