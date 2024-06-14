import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt, options } from '../utils.js'
import { createCommand, sendActionCommand } from './action-utils.js'

export enum ActionIdZoomISOConfig {
	loadISOConfig = 'load_ISO_Config',
	saveISOConfig = 'save_ISO_Config',
	mergeISOConfig = 'merge_ISO_Config',
	getConfigPath = 'get_Config_Path',
}

export function GetActionsZoomISOConfig(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdZoomISOConfig]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdZoomISOConfig]: CompanionActionDefinition | undefined } = {
		[ActionIdZoomISOConfig.loadISOConfig]: {
			name: 'Load Config',
			options: [options.path],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/loadConfig')
				command.args.push({ type: 'i', value: action.options.path })
				const sendToCommand = {
					id: ActionIdZoomISOConfig.loadISOConfig,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdZoomISOConfig.saveISOConfig]: {
			name: 'Save Config',
			options: [options.path],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/saveConfig')
				command.args.push({ type: 'i', value: action.options.path })
				const sendToCommand = {
					id: ActionIdZoomISOConfig.saveISOConfig,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdZoomISOConfig.mergeISOConfig]: {
			name: 'Merge Config',
			options: [options.path],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/mergeConfig')
				command.args.push({ type: 'i', value: action.options.path })
				const sendToCommand = {
					id: ActionIdZoomISOConfig.mergeISOConfig,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdZoomISOConfig.getConfigPath]: {
			name: 'getConfig path',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/getConfigPath')
				const sendToCommand = {
					id: ActionIdZoomISOConfig.getConfigPath,
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
