import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt } from '../utils.js'
import { createCommand, sendActionCommand } from './action-utils.js'

export enum ActionIdZoomISOEngine {
	stopISOEngine = 'stop_ISO_Engine',
	startISOEngine = 'start_ISO_Engine',
	standbyISOEngine = 'standby_ISO_Engine',
	requestCapturePermission = 'request_capture_permission',
}

export function GetActionsZoomISOEngine(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdZoomISOEngine]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdZoomISOEngine]: CompanionActionDefinition | undefined } = {
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
			name: 'Standby ISO Engine',
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
	}

	return actions
}
