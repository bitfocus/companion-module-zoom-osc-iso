import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt, options } from '../utils.js'
import { createCommand, sendActionCommand } from './action-utils.js'

export enum ActionIdGlobalChat {
	sendAChatToEveryone = 'sendAChatToEveryone',
}

export function GetActionsGlobalChat(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdGlobalChat]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdGlobalChat]: CompanionActionDefinition | undefined } = {
		[ActionIdGlobalChat.sendAChatToEveryone]: {
			name: 'Send A Chat To Everyone',
			options: [options.message],
			callback: async (action): Promise<void> => {
				// type: 'Global'
				const command = createCommand(instance, '/chatAll')
				const message = await instance.parseVariablesInString(action.options.message as string)
				command.args.push({ type: 's', value: message.replaceAll('\\n', '\n') })
				const sendToCommand = {
					id: ActionIdGlobalChat.sendAChatToEveryone,
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
