import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt } from '../utils.js'
import { createCommand, sendActionCommand } from './action-utils.js'

export enum ActionIdGlobalMemoryManagement {
	// update target ids
	// include
	// load from target list
	// load via OSC
	// Save to target list
	// Reset
	listUsers = 'listUsers',
}

export function GetActionsGlobalMemoryManagement(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdGlobalMemoryManagement]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdGlobalMemoryManagement]: CompanionActionDefinition | undefined } = {
		[ActionIdGlobalMemoryManagement.listUsers]: {
			name: 'Request list of Participants (PRO)',
			options: [],
			callback: (): void => {
				// type: 'Special'
				const command = createCommand(instance, '/list')
				const sendToCommand = {
					id: ActionIdGlobalMemoryManagement.listUsers,
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
