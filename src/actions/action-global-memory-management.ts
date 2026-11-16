import type ModuleInstance from '../index.js'
import type { CompanionActionDefinitions } from '@companion-module/base'
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

export type ActionsSchemaGlobalMemoryManagement = {
	[ActionIdGlobalMemoryManagement.listUsers]: { options: Record<string, never> }
}

export function GetActionsGlobalMemoryManagement(
	instance: ModuleInstance,
): CompanionActionDefinitions<ActionsSchemaGlobalMemoryManagement> {
	const actions: CompanionActionDefinitions<ActionsSchemaGlobalMemoryManagement> = {
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
