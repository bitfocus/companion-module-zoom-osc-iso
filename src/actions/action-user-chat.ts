import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config'
import { InstanceBaseExt, options } from '../utils'
import { createCommand, select, sendActionCommand } from './action-utils'

export enum ActionIdUserChat {
	sendAChatViaDM = 'sendAChatViaDM',
}

export function GetActionsUserChat(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdUserChat]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdUserChat]: CompanionActionDefinition | undefined } = {
		[ActionIdUserChat.sendAChatViaDM]: {
			name: 'Chat Via DM',
			options: [options.userName, options.message],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const message = await instance.parseVariablesInString(action.options.message as string)
				const command = createCommand(instance, '/chat', userName, select.multi)
				if (command.isValidCommand) {
					command.args.push({ type: 's', value: message })
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
