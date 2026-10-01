import type ModuleInstance from '../index.js'
import type { CompanionActionDefinitions } from '@companion-module/base'
import { options } from '../utils.js'
import { createCommand, select, sendActionCommand } from './action-utils.js'

export enum ActionIdUserVideoMic {
	turnVideoOn = 'turnVideoOn',
	turnVideoOff = 'turnVideoOff',
	toggleVideoState = 'toggleVideoState',
	mute = 'mute',
	unmute = 'unmute',
	toggleMuteState = 'toggleMuteState',
}

export type ActionsSchemaUserVideoMic = {
	[ActionIdUserVideoMic.turnVideoOn]: { options: { userName: string } }
	[ActionIdUserVideoMic.turnVideoOff]: { options: { userName: string } }
	[ActionIdUserVideoMic.toggleVideoState]: { options: { userName: string } }
	[ActionIdUserVideoMic.mute]: { options: { userName: string } }
	[ActionIdUserVideoMic.unmute]: { options: { userName: string } }
	[ActionIdUserVideoMic.toggleMuteState]: { options: { userName: string } }
}

export function GetActionsUserVideoMic(
	instance: ModuleInstance,
): CompanionActionDefinitions<ActionsSchemaUserVideoMic> {
	const actions: CompanionActionDefinitions<ActionsSchemaUserVideoMic> = {
		[ActionIdUserVideoMic.turnVideoOn]: {
			name: 'Video On',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
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
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
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
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
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
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
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
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
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
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
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
