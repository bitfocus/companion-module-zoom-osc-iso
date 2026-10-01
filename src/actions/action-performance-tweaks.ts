import type ModuleInstance from '../index.js'
import type { CompanionActionDefinitions } from '@companion-module/base'

export enum ActionIdPerformanceTweaks {
	turnOnEnableVariablesForEachUser = 'EnableVariablesForEachUser',
	turnOffEnableVariablesForEachUser = 'DisableVariablesForEachUser',
	toggleEnableVariablesForEachUser = 'ToggleVariablesForEachUser',
	turnOnEnableVariablesForParticipants = 'EnableVariablesForParticipants',
	turnOffEnableVariablesForParticipants = 'DisableVariablesForParticipants',
	toggleEnableVariablesForParticipants = 'ToggleVariablesForParticipants',
}

export type ActionsSchemaPerformanceTweaks = {
	[ActionIdPerformanceTweaks.turnOnEnableVariablesForEachUser]: { options: Record<string, never> }
	[ActionIdPerformanceTweaks.turnOffEnableVariablesForEachUser]: { options: Record<string, never> }
	[ActionIdPerformanceTweaks.toggleEnableVariablesForEachUser]: { options: Record<string, never> }
	[ActionIdPerformanceTweaks.turnOnEnableVariablesForParticipants]: { options: Record<string, never> }
	[ActionIdPerformanceTweaks.turnOffEnableVariablesForParticipants]: { options: Record<string, never> }
	[ActionIdPerformanceTweaks.toggleEnableVariablesForParticipants]: { options: Record<string, never> }
}

export function GetActionsPerformanceTweaks(
	instance: ModuleInstance,
): CompanionActionDefinitions<ActionsSchemaPerformanceTweaks> {
	const actions: CompanionActionDefinitions<ActionsSchemaPerformanceTweaks> = {
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
