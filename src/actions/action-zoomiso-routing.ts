import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt, options } from '../utils.js'
import { createCommand, select, sendActionCommand } from './action-utils.js'

export enum ActionIdZoomISORouting {
	outputISO = 'output_ISO',
	outputISOSetToNone = 'output_ISO_set_to_none',
	audioISO = 'audio_ISO',
	togglePollOutputRouting = 'toggle_poll_output_routing',
	togglePollAudioRouting = 'toggle_poll_audio_routing',
}

export function GetActionsZoomISORouting(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdZoomISORouting]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdZoomISORouting]: CompanionActionDefinition | undefined } = {
		[ActionIdZoomISORouting.outputISO]: {
			name: 'output ISO',
			options: [
				options.userName,
				options.output,
				{
					type: 'checkbox',
					id: 'setToNoneIfNotUserSelected',
					label: 'If No User Selected, Set Output to None',
					default: false,
				},
			],
			callback: async (action): Promise<void> => {
				// type: 'ISO'
				const variableValue = action.options.userName as string
				const setToNoneIfNotUserSelected = (action.options.setToNoneIfNotUserSelected as boolean) ?? false
				const command = createCommand(
					instance,
					'/outputISO',
					variableValue,
					select.single,
					null,
					true,
					setToNoneIfNotUserSelected,
					false,
				)
				if (command.isValidCommand) {
					command.args.push({ type: 'i', value: action.options.output })

					const sendToCommand = {
						id: ActionIdZoomISORouting.outputISO,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdZoomISORouting.audioISO]: {
			name: 'audio ISO',
			options: [options.userName, options.output],
			callback: async (action): Promise<void> => {
				// type: 'ISO'
				const variableValue = action.options.userName as string
				const command = createCommand(instance, '/audioISO', variableValue, select.single)
				if (command.isValidCommand) {
					command.args.push({ type: 'i', value: action.options.output })

					const sendToCommand = {
						id: ActionIdZoomISORouting.audioISO,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdZoomISORouting.outputISOSetToNone]: {
			name: 'Set ISO Output to None',
			options: [options.output],
			callback: async (action): Promise<void> => {
				// type: 'ISO'
				const command = createCommand(instance, '/outputISO', '', select.single, null, true, true, true)
				if (command.isValidCommand) {
					command.args.push({ type: 'i', value: action.options.output })

					const sendToCommand = {
						id: ActionIdZoomISORouting.outputISOSetToNone,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdZoomISORouting.togglePollOutputRouting]: {
			name: 'Toggle Poll Output Routing',
			options: [],
			callback: (): void => {
				instance.config.pollOutputRouting = !instance.config.pollOutputRouting
				instance.saveConfig(instance.config)
			},
		},
		[ActionIdZoomISORouting.togglePollAudioRouting]: {
			name: 'Toggle Poll Audio Routing',
			options: [],
			callback: (): void => {
				instance.config.pollAudioRouting = !instance.config.pollAudioRouting
				instance.saveConfig(instance.config)
			},
		},
	}

	return actions
}
