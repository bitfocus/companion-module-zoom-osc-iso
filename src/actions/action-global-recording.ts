import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt } from '../utils.js'
import { createCommand, sendActionCommand } from './action-utils.js'

export enum ActionIdGlobalRecording {
	startLocalRecording = 'startLocalRecording',
	pauseLocalRecording = 'pauseLocalRecording',
	resumeLocalRecording = 'resumeLocalRecording',
	stopLocalRecording = 'stopLocalRecording',
	startCloudRecording = 'startCloudRecording',
	pauseCloudRecording = 'pauseCloudRecording',
	resumeCloudRecording = 'resumeCloudRecording',
	stopCloudRecording = 'stopCloudRecording',
}

export function GetActionsGlobalRecording(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdGlobalRecording]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdGlobalRecording]: CompanionActionDefinition | undefined } = {
		[ActionIdGlobalRecording.startLocalRecording]: {
			name: 'Start Local Recording',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/startLocalRecording')
				const sendToCommand = {
					id: ActionIdGlobalRecording.startLocalRecording,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalRecording.pauseLocalRecording]: {
			name: 'Pause Local Recording',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/pauseLocalRecording')
				const sendToCommand = {
					id: ActionIdGlobalRecording.pauseLocalRecording,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalRecording.resumeLocalRecording]: {
			name: 'Resume Local Recording',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/resumeLocalRecording')
				const sendToCommand = {
					id: ActionIdGlobalRecording.resumeLocalRecording,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalRecording.stopLocalRecording]: {
			name: 'Stop Local Recording',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/stopLocalRecording')
				const sendToCommand = {
					id: ActionIdGlobalRecording.stopLocalRecording,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalRecording.startCloudRecording]: {
			name: 'Start Cloud Recording',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/startCloudRecording')
				const sendToCommand = {
					id: ActionIdGlobalRecording.startCloudRecording,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalRecording.pauseCloudRecording]: {
			name: 'Pause Cloud Recording',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/pauseCloudRecording')
				const sendToCommand = {
					id: ActionIdGlobalRecording.pauseCloudRecording,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalRecording.resumeCloudRecording]: {
			name: 'Resume Cloud Recording',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/resumeCloudRecording')
				const sendToCommand = {
					id: ActionIdGlobalRecording.resumeCloudRecording,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalRecording.stopCloudRecording]: {
			name: 'Stop Cloud Recording',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/stopCloudRecording')
				const sendToCommand = {
					id: ActionIdGlobalRecording.stopCloudRecording,
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
