import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt, options } from '../utils.js'
import { createCommand, sendActionCommand } from './action-utils.js'

export enum ActionIdZoomISOOutputSettings {
	setOutputCount = 'set_Output_Count',
	enableOutput = 'enable_Output',
	disableOutput = 'disable_Output',
	setOutputMode = 'set_Output_Mode',
	setOutputName = 'set_Output_Name',
	setVideoLossMode = 'set_VideoLoss_Mode',
	addOutput = 'add_Output',
	deleteOutput = 'delete_Output',
	setAudioMode = 'set_Audio_Mode',
}

export function GetActionsZoomISOOutputSettings(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdZoomISOOutputSettings]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdZoomISOOutputSettings]: CompanionActionDefinition | undefined } = {
		[ActionIdZoomISOOutputSettings.setVideoLossMode]: {
			name: 'set Video Loss Mode',
			options: [options.videoLossMode],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/setVideoLossMode')
				command.args.push({ type: 's', value: action.options.videoLossMode })

				const sendToCommand = {
					id: ActionIdZoomISOOutputSettings.setVideoLossMode,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdZoomISOOutputSettings.deleteOutput]: {
			name: 'delete Output',
			options: [options.output],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/deleteOutput')
				command.args.push({ type: 'i', value: action.options.output })

				const sendToCommand = {
					id: ActionIdZoomISOOutputSettings.deleteOutput,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdZoomISOOutputSettings.setOutputCount]: {
			name: 'set Output Count',
			options: [options.count],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/setOutputCount')
				command.args.push({ type: 'i', value: action.options.count })
				const sendToCommand = {
					id: ActionIdZoomISOOutputSettings.setOutputCount,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdZoomISOOutputSettings.enableOutput]: {
			name: 'enableOutput',
			options: [options.output],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/enableOutput')
				command.args.push({ type: 'i', value: action.options.output })
				const sendToCommand = {
					id: ActionIdZoomISOOutputSettings.setOutputCount,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdZoomISOOutputSettings.setAudioMode]: {
			name: 'setAudioMode',
			options: [options.channel, options.audioChannelMode],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/setAudioMode')
				command.args.push({ type: 'i', value: action.options.number })
				command.args.push({ type: 's', value: action.options.audioChannelMode })
				const sendToCommand = {
					id: ActionIdZoomISOOutputSettings.setAudioMode,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdZoomISOOutputSettings.addOutput]: {
			name: 'addOutput',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/addOutput')

				const sendToCommand = {
					id: ActionIdZoomISOOutputSettings.addOutput,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},

		[ActionIdZoomISOOutputSettings.disableOutput]: {
			name: 'disableOutput',
			options: [options.output],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/disableOutput')
				command.args.push({ type: 'i', value: action.options.output })
				const sendToCommand = {
					id: ActionIdZoomISOOutputSettings.disableOutput,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdZoomISOOutputSettings.setOutputName]: {
			name: 'set Output Name',
			options: [options.output, options.name],
			callback: async (action): Promise<void> => {
				// type: 'ISO'
				const command = createCommand(instance, '/setOutputName')
				const newName = await instance.parseVariablesInString(action.options.name as string)
				command.args.push({ type: 'i', value: action.options.output })
				command.args.push({ type: 's', value: newName })

				const sendToCommand = {
					id: ActionIdZoomISOOutputSettings.setOutputName,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdZoomISOOutputSettings.setOutputMode]: {
			name: 'setOutputMode',
			options: [
				options.output,
				{
					type: 'dropdown',
					label: 'Output Mode',
					id: 'outputMode',
					default: 'Spotlight',
					choices: [
						{ id: 'Participant', label: 'Participant' },
						{ id: 'Participant Share', label: 'Participant Share' },
						{ id: 'Active Speaker', label: 'Active Speaker' },
						{ id: 'Spotlight', label: 'Spotlight' },
						{ id: 'Active Screenshare', label: 'Active Screenshare' },
						{ id: 'Gallery Position', label: 'Gallery Position' },
						{ id: 'Unique Speaker', label: 'Unique Speaker' },
					],
				},
			],
			callback: (action): void => {
				// type: 'ISO'
				instance.log('debug', `setOutputMode: ${JSON.stringify(action.options.outputMode)}`)
				const command = createCommand(instance, '/setOutputMode')
				command.args.push({ type: 'i', value: action.options.output })
				command.args.push({ type: 's', value: action.options.outputMode })
				instance.log('debug', `setOutputMode: ${JSON.stringify(command)}`)
				const sendToCommand = {
					id: ActionIdZoomISOOutputSettings.setOutputMode,
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
