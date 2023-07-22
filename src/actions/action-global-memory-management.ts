import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config'
import { InstanceBaseExt } from '../utils'
import { createCommand, sendActionCommand } from './action-utils'

export enum ActionIdGlobalMemoryManagement {
	listUsers = 'listUsers',
}

export function GetActionsGlobalMemoryManagement(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdGlobalMemoryManagement]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdGlobalMemoryManagement]: CompanionActionDefinition | undefined } = {
		[ActionIdGlobalMemoryManagement.listUsers]: {
			name: 'Request list of Participants',
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
