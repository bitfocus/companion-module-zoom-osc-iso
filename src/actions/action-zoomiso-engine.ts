import type ModuleInstance from '../index.js'
import type { CompanionActionDefinitions } from '@companion-module/base'
import { createCommand, sendActionCommand } from './action-utils.js'

export enum ActionIdZoomISOEngine {
	stopISOEngine = 'stop_ISO_Engine',
	startISOEngine = 'start_ISO_Engine',
	standbyISOEngine = 'standby_ISO_Engine',
	requestCapturePermission = 'request_capture_permission',
	togglePollEngineState = 'toggle_poll_engine_state',
}

export type ActionsSchemaZoomISOEngine = {
	[ActionIdZoomISOEngine.startISOEngine]: { options: Record<string, never> }
	[ActionIdZoomISOEngine.stopISOEngine]: { options: Record<string, never> }
	[ActionIdZoomISOEngine.standbyISOEngine]: { options: Record<string, never> }
	[ActionIdZoomISOEngine.requestCapturePermission]: { options: Record<string, never> }
	[ActionIdZoomISOEngine.togglePollEngineState]: { options: Record<string, never> }
}

export function GetActionsZoomISOEngine(
	instance: ModuleInstance,
): CompanionActionDefinitions<ActionsSchemaZoomISOEngine> {
	const actions: CompanionActionDefinitions<ActionsSchemaZoomISOEngine> = {
		[ActionIdZoomISOEngine.startISOEngine]: {
			name: 'Start ISO Engine',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/startISOEngine')

				const sendToCommand = {
					id: ActionIdZoomISOEngine.startISOEngine,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdZoomISOEngine.stopISOEngine]: {
			name: 'Stop ISO Engine',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/stopISOEngine')

				const sendToCommand = {
					id: ActionIdZoomISOEngine.stopISOEngine,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdZoomISOEngine.standbyISOEngine]: {
			name: 'Standby ISO Engine (Deprecated)',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/standbyISOEngine')

				const sendToCommand = {
					id: ActionIdZoomISOEngine.standbyISOEngine,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdZoomISOEngine.requestCapturePermission]: {
			name: 'Request Capture Permission',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/requestCapturePermission')
				// instance.log('warn', `requestCapturePermission ************************ ${command.oscPath}`)
				const sendToCommand = {
					id: ActionIdZoomISOEngine.requestCapturePermission,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdZoomISOEngine.togglePollEngineState]: {
			name: 'Toggle Poll Engine State',
			options: [],
			callback: (): void => {
				instance.config.pollEngineState = !instance.config.pollEngineState
				instance.saveConfig(instance.config)
			},
		},
	}

	return actions
}
