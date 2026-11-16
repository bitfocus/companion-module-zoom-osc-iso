import type ModuleInstance from '../index.js'
import type { CompanionActionDefinitions } from '@companion-module/base'
import { options } from '../utils.js'
import { createCommand, select, sendActionCommand } from './action-utils.js'

export enum ActionIdUserChat {
	sendAChatViaDM = 'sendAChatViaDM',
}

export type ActionsSchemaUserChat = {
	[ActionIdUserChat.sendAChatViaDM]: { options: { userName: string; message: string } }
}

export function GetActionsUserChat(instance: ModuleInstance): CompanionActionDefinitions<ActionsSchemaUserChat> {
	const actions: CompanionActionDefinitions<ActionsSchemaUserChat> = {
		[ActionIdUserChat.sendAChatViaDM]: {
			name: 'Chat Via DM',
			options: [options.userName, options.messageWithVariables],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const message = action.options.message
				const command = createCommand(instance, '/chat', userName, select.multi)
				if (command.isValidCommand) {
					command.args.push({ type: 's', value: message.replaceAll('\\n', '\n') })
					const sendToCommand = {
						id: ActionIdUserChat.sendAChatViaDM,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
	}

	return actions
}
