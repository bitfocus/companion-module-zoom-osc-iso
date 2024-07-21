import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt, options } from '../utils.js'
import { socialStreamApi } from '../socialstream.js'

export enum ActionIdSocialStream {
	sendAChatToSocialStream = 'sendAChatToSocialStream',
	turnOnSocialStream = 'turnOnSocialStream',
	turnOffSocialStream = 'turnOffSocialStream',
	toggleSocialStream = 'toggleSocialStream',
}

export function GetActionsSocalSteam(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdSocialStream]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdSocialStream]: CompanionActionDefinition | undefined } = {
		[ActionIdSocialStream.sendAChatToSocialStream]: {
			name: 'Send A Chat To Social Stream',
			options: [options.name, options.message],
			callback: async (action): Promise<void> => {
				const socialStreamEnabled = instance.config.enableSocialStream
				if (socialStreamEnabled) {
					const message = await instance.parseVariablesInString(action.options.message as string)
					const name = await instance.parseVariablesInString(action.options.name as string)
					await socialStreamApi.postMessage(name, message, instance)
				} else {
					instance.log('warn', 'Social Stream is not enabled in config')
				}
			},
		},
		[ActionIdSocialStream.turnOnSocialStream]: {
			name: 'Turn On Social Stream',
			options: [],
			callback: async (): Promise<void> => {
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
			callback: async (): Promise<void> => {
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
			callback: async (): Promise<void> => {
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
