import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt } from '../utils.js'

export enum ActionIdPerformanceTweaks {
	turnOnEnableVariablesForEachUser = 'EnableVariablesForEachUser',
	turnOffEnableVariablesForEachUser = 'DisableVariablesForEachUser',
	toggleEnableVariablesForEachUser = 'ToggleVariablesForEachUser',
	turnOnEnableVariablesForParticipants = 'EnableVariablesForParticipants',
	turnOffEnableVariablesForParticipants = 'DisableVariablesForParticipants',
	toggleEnableVariablesForParticipants = 'ToggleVariablesForParticipants',
}

export function GetActionsPerformanceTweaks(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdPerformanceTweaks]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdPerformanceTweaks]: CompanionActionDefinition | undefined } = {
		[ActionIdPerformanceTweaks.turnOnEnableVariablesForEachUser]: {
			name: 'Performance Tweak - Turn On Variables For Each User',
			options: [],
			callback: (): void => {
				const enabled = instance.config.enableVariablesForEachUser
				if (enabled == false) {
					instance.config.enableVariablesForEachUser = true
					instance.saveConfig(instance.config)
				}
			},
		},
		[ActionIdPerformanceTweaks.turnOffEnableVariablesForEachUser]: {
			name: 'Performance Tweak - Turn Off Variables For Each User',
			options: [],
			callback: (): void => {
				const enabled = instance.config.enableVariablesForEachUser
				if (enabled == true) {
					instance.config.enableVariablesForEachUser = false
					instance.saveConfig(instance.config)
				}
			},
		},
		[ActionIdPerformanceTweaks.toggleEnableVariablesForEachUser]: {
			name: 'Performance Tweak - Toggle Variables For Each User On/Off',
			options: [],
			callback: (): void => {
				const enabled = instance.config.enableVariablesForEachUser
				if (enabled == true) {
					instance.config.enableVariablesForEachUser = false
					instance.saveConfig(instance.config)
				} else {
					instance.config.enableVariablesForEachUser = true
					instance.saveConfig(instance.config)
				}
			},
		},
		[ActionIdPerformanceTweaks.turnOnEnableVariablesForParticipants]: {
			name: 'Performance Tweak - Turn On Variables For Each Participant',
			options: [],
			callback: (): void => {
				const enabled = instance.config.enableVariablesForParticipants
				if (enabled == false) {
					instance.config.enableVariablesForParticipants = true
					instance.saveConfig(instance.config)
				}
			},
		},
		[ActionIdPerformanceTweaks.turnOffEnableVariablesForParticipants]: {
			name: 'Performance Tweak - Turn Off Variables For Each Participant',
			options: [],
			callback: (): void => {
				const enabled = instance.config.enableVariablesForParticipants
				if (enabled == true) {
					instance.config.enableVariablesForParticipants = false
					instance.saveConfig(instance.config)
				}
			},
		},
		[ActionIdPerformanceTweaks.toggleEnableVariablesForParticipants]: {
			name: 'Performance Tweak - Toggle Variables For Each Participant On/Off',
			options: [],
			callback: (): void => {
				const enabled = instance.config.enableVariablesForParticipants
				if (enabled == true) {
					instance.config.enableVariablesForParticipants = false
					instance.saveConfig(instance.config)
				} else {
					instance.config.enableVariablesForParticipants = true
					instance.saveConfig(instance.config)
				}
			},
		},
	}

	return actions
}
