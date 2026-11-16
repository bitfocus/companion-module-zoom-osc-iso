import type ModuleInstance from '../index.js'
import type { CompanionActionDefinitions } from '@companion-module/base'
import { options } from '../utils.js'
import { socialStreamApi } from '../socialstream.js'

export enum ActionIdSocialStream {
	sendAChatToSocialStream = 'sendAChatToSocialStream',
	turnOnSocialStream = 'turnOnSocialStream',
	turnOffSocialStream = 'turnOffSocialStream',
	toggleSocialStream = 'toggleSocialStream',
}

export type ActionsSchemaSocialStream = {
	[ActionIdSocialStream.sendAChatToSocialStream]: { options: { name: string; message: string } }
	[ActionIdSocialStream.turnOnSocialStream]: { options: Record<string, never> }
	[ActionIdSocialStream.turnOffSocialStream]: { options: Record<string, never> }
	[ActionIdSocialStream.toggleSocialStream]: { options: Record<string, never> }
}

export function GetActionsSocalSteam(instance: ModuleInstance): CompanionActionDefinitions<ActionsSchemaSocialStream> {
	const actions: CompanionActionDefinitions<ActionsSchemaSocialStream> = {
		[ActionIdSocialStream.sendAChatToSocialStream]: {
			name: 'Send A Chat To Social Stream',
			options: [options.name, options.messageWithVariables],
			callback: async (action): Promise<void> => {
				const socialStreamEnabled = instance.config.enableSocialStream
				if (socialStreamEnabled) {
					const message = action.options.message
					const name = action.options.name
					await socialStreamApi.postMessage(name, message, instance)
				} else {
					instance.log('warn', 'Social Stream is not enabled in config')
				}
			},
		},
		[ActionIdSocialStream.turnOnSocialStream]: {
			name: 'Turn On Social Stream',
			options: [],
			callback: (): void => {
				const socialStreamEnabled = instance.config.enableSocialStream
				if (socialStreamEnabled == false) {
					instance.config.enableSocialStream = true
					instance.saveConfig(instance.config)
				}
			},
		},
		[ActionIdSocialStream.turnOffSocialStream]: {
			name: 'Turn Off Social Stream',
			options: [],
			callback: (): void => {
				const socialStreamEnabled = instance.config.enableSocialStream
				if (socialStreamEnabled == true) {
					instance.config.enableSocialStream = false
					instance.saveConfig(instance.config)
				}
			},
		},
		[ActionIdSocialStream.toggleSocialStream]: {
			name: 'Toggle Social Stream On/Off',
			options: [],
			callback: (): void => {
				const socialStreamEnabled = instance.config.enableSocialStream
				if (socialStreamEnabled == true) {
					instance.config.enableSocialStream = false
					instance.saveConfig(instance.config)
				} else {
					instance.config.enableSocialStream = true
					instance.saveConfig(instance.config)
				}
			},
		},
	}

	return actions
}
