import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config'
import { InstanceBaseExt, options } from '../utils'
import { createCommand, sendActionCommand, select } from './action-utils'

export enum ActionIdUserSettings {
	hideUserNamesOnVideo = 'hideUserNamesOnVideo',
	showUserNamesOnVideo = 'showUserNamesOnVideo',
	hideNonVideoParticipants = 'hideNonVideoParticipants',
	showNonVideoParticipants = 'showNonVideoParticipants',
	enableOriginalSound = 'enableOriginalSound',
	disableOriginalSound = 'disableOriginalSound',
	setCameraDevice = 'setCameraDevice',
	setSpeakerDevice = 'setSpeakerDevice',
	enableHDVideo = 'enableHDVideo',
	disableHDVideo = 'disableHDVideo',
	enableMirrorVideo = 'enableMirrorVideo',
	disableMirrorVideo = 'disableMirrorVideo',
	setVideoFilter = 'setVideoFilter',
	setMicLevel = 'setMicLevel',
	setMicDevice = 'setMicDevice',
	setSpeakerVolume = 'setSpeakerVolume',
	setVirtualBackground = 'setVirtualBackground',
	hideSelfView = 'hideSelfView',
	showSelfView = 'showSelfView',
}

export function GetActionsUserSettings(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdUserSettings]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdUserSettings]: CompanionActionDefinition | undefined } = {
		[ActionIdUserSettings.hideSelfView]: {
			name: 'Hide Self View  (PRO and MAC Only)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/hideSelfView')
				const sendToCommand = {
					id: ActionIdUserSettings.hideSelfView,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdUserSettings.showSelfView]: {
			name: 'Show Self View (PRO and MAC Only)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/showSelfView')
				const sendToCommand = {
					id: ActionIdUserSettings.showSelfView,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdUserSettings.showNonVideoParticipants]: {
			name: 'Show Non Video Participants',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/showNonVideoParticipants')
				const sendToCommand = {
					id: ActionIdUserSettings.showNonVideoParticipants,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdUserSettings.hideNonVideoParticipants]: {
			name: 'Hide Non Video Participants',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/hideNonVideoParticipants')
				const sendToCommand = {
					id: ActionIdUserSettings.hideNonVideoParticipants,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdUserSettings.showUserNamesOnVideo]: {
			name: 'Show User Names On Video',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/showUserNames')
				const sendToCommand = {
					id: ActionIdUserSettings.showUserNamesOnVideo,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdUserSettings.hideUserNamesOnVideo]: {
			name: 'Hide User Names On Video',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/hideUserNames')
				const sendToCommand = {
					id: ActionIdUserSettings.hideUserNamesOnVideo,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdUserSettings.enableOriginalSound]: {
			name: 'Enable Original Sound',
			options: [options.userName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/enableOriginalSound', userName, select.single)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserSettings.enableOriginalSound,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserSettings.disableOriginalSound]: {
			name: 'Disable Original Sound',
			options: [options.userName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/disableOriginalSound', userName, select.single)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserSettings.disableOriginalSound,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserSettings.enableHDVideo]: {
			name: 'Enable HD Video (PRO)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/enableHDVideo')
				const sendToCommand = {
					id: ActionIdUserSettings.enableHDVideo,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdUserSettings.disableHDVideo]: {
			name: 'Disable HD Video (PRO)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/disableHDVideo')
				const sendToCommand = {
					id: ActionIdUserSettings.disableHDVideo,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdUserSettings.enableMirrorVideo]: {
			name: 'Enable Mirror Video (PRO)',
			options: [options.userName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/enableMirrorVideo', userName, select.single)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserSettings.enableMirrorVideo,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserSettings.disableMirrorVideo]: {
			name: 'Disable Mirror Video (PRO)',
			options: [options.userName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/disableMirrorVideo', userName, select.single)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserSettings.disableMirrorVideo,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserSettings.setVirtualBackground]: {
			name: 'Set Virtual Background (PRO and MAC Only)',
			options: [options.userName, options.id],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/setBackground', userName, select.single)
				if (command.isValidCommand) {
					command.args.push({ type: 'i', value: action.options.id })
					const sendToCommand = {
						id: ActionIdUserSettings.setVirtualBackground,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserSettings.setVideoFilter]: {
			name: 'Set Video Filter (PRO and MAC Only)',
			options: [options.userName, options.id],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/setVideoFilter', userName, select.single)
				if (command.isValidCommand) {
					command.args.push({ type: 'i', value: action.options.id })
					const sendToCommand = {
						id: ActionIdUserSettings.setVideoFilter,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserSettings.setCameraDevice]: {
			name: 'Set Camera Device (PRO)',
			options: [options.userName, options.id],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/setCameraDevice', userName, select.single)
				if (command.isValidCommand) {
					command.args.push({ type: 'i', value: action.options.id })
					const sendToCommand = {
						id: ActionIdUserSettings.setCameraDevice,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserSettings.setSpeakerVolume]: {
			name: 'Set Speaker Volume (PRO)',
			options: [options.userName, options.level],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/setSpeakerVolume', userName, select.multi)
				if (command.isValidCommand) {
					command.args.push({ type: 'i', value: action.options.level })
					const sendToCommand = {
						id: ActionIdUserSettings.setSpeakerVolume,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserSettings.setSpeakerDevice]: {
			name: 'Set Speaker Device (PRO)',
			options: [options.userName, options.id],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/setSpeakerDevice', userName, select.single)
				if (command.isValidCommand) {
					command.args.push({ type: 'i', value: action.options.id })
					const sendToCommand = {
						id: ActionIdUserSettings.setSpeakerDevice,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserSettings.setMicDevice]: {
			name: 'Set Mic Device (PRO)',
			options: [options.userName, options.id],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/setMicDevice', userName, select.single)
				if (command.isValidCommand) {
					command.args.push({ type: 'i', value: action.options.id })
					const sendToCommand = {
						id: ActionIdUserSettings.setMicDevice,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserSettings.setMicLevel]: {
			name: 'Set Mic Level (PRO)',
			options: [options.level],
			callback: (action): void => {
				// type: 'User'
				const command = createCommand(instance, '/setMicLevel')
				command.args.push({ type: 'i', value: action.options.level })
				const sendToCommand = {
					id: ActionIdUserSettings.setMicLevel,
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
