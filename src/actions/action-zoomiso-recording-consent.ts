import type ModuleInstance from '../index.js'
import type { CompanionActionDefinitions } from '@companion-module/base'
import { createCommand, sendActionCommand } from './action-utils.js'

export enum ActionIdZoomISORecordingConsent {
	acceptRecordingConsent = 'accept_Recording_Consent',
}

export type ActionsSchemaZoomISORecordingConsent = {
	[ActionIdZoomISORecordingConsent.acceptRecordingConsent]: { options: Record<string, never> }
}

export function GetActionsZoomISORecordingConsent(
	instance: ModuleInstance,
): CompanionActionDefinitions<ActionsSchemaZoomISORecordingConsent> {
	const actions: CompanionActionDefinitions<ActionsSchemaZoomISORecordingConsent> = {
		[ActionIdZoomISORecordingConsent.acceptRecordingConsent]: {
			name: 'Accept Recording Consent',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/acceptRecordingConsent')
				const sendToCommand = {
					id: ActionIdZoomISORecordingConsent.acceptRecordingConsent,
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
