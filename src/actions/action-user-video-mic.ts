import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt, options } from '../utils.js'
import { createCommand, select, sendActionCommand } from './action-utils.js'

export enum ActionIdUserVideoMic {
	turnVideoOn = 'turnVideoOn',
	turnVideoOff = 'turnVideoOff',
	toggleVideoState = 'toggleVideoState',
	mute = 'mute',
	unmute = 'unmute',
	toggleMuteState = 'toggleMuteState',
}

export function GetActionsUserVideoMic(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdUserVideoMic]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdUserVideoMic]: CompanionActionDefinition | undefined } = {
		[ActionIdUserVideoMic.turnVideoOn]: {
			name: 'Video On',
			options: [options.userName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/videoOn', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserVideoMic.turnVideoOn,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserVideoMic.turnVideoOff]: {
			name: 'Video Off',
			options: [options.userName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/videoOff', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserVideoMic.turnVideoOff,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserVideoMic.toggleVideoState]: {
			name: 'Toggle Video State',
			options: [options.userName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/toggleVideo', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserVideoMic.toggleVideoState,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserVideoMic.mute]: {
			name: 'Mute',
			options: [options.userName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/mute', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserVideoMic.mute,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserVideoMic.unmute]: {
			name: 'Unmute',
			options: [options.userName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/unMute', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserVideoMic.unmute,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserVideoMic.toggleMuteState]: {
			name: 'Toggle Mute State',
			options: [options.userName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/toggleMute', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserVideoMic.toggleMuteState,
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
