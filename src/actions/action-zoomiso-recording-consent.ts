import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt } from '../utils.js'
import { createCommand, sendActionCommand } from './action-utils.js'

export enum ActionIdZoomISORecordingConsent {
	acceptRecordingConsent = 'accept_Recording_Consent',
}

export function GetActionsZoomISORecordingConsent(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdZoomISORecordingConsent]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdZoomISORecordingConsent]: CompanionActionDefinition | undefined } = {
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
