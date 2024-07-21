import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt, options } from '../utils.js'
import { createCommand, select, sendActionCommand } from './action-utils.js'

export enum ActionIdUserScreenshare {
	// List Screens
	// List Windows
	startScreenShare = 'startScreenShare',
	startShareWithWindow = 'startShareWithWindow',
	stopSharing = 'stopSharing',
	startScreenShareWithPrimaryScreen = 'startScreenShareWithPrimaryScreen',
	startAudioShare = 'startAudioShare',
	enableComputerSoundWhenSharing = 'enableComputerSoundWhenSharing',
	disableComputerSoundWhenSharing = 'disableComputerSoundWhenSharing',
	startCameraShare = 'startCameraShare',
	cycleSharedCameraToNextAvailable = 'cycleSharedCameraToNextAvailable',
	enableOptimizeVideoForSharing = 'enableOptimizeVideoForSharing',
	disableOptimizeVideoForSharing = 'disableOptimizeVideoForSharing',
	SetWindowSize = 'SetWindowSize',
	SetWindowPosition = 'SetWindowPosition',
}

export function GetActionsUserScreenshare(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdUserScreenshare]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdUserScreenshare]: CompanionActionDefinition | undefined } = {
		[ActionIdUserScreenshare.startScreenShare]: {
			name: 'Screen Share (PRO)',
			options: [options.id],
			callback: (action): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/startScreenShare')
				command.args.push({ type: 'i', value: action.options.id })
				const sendToCommand = {
					id: ActionIdUserScreenshare.startScreenShare,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdUserScreenshare.enableOptimizeVideoForSharing]: {
			name: 'Enable Optimize Video For Sharing (PRO)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/enableOptimizeVideo')
				const sendToCommand = {
					id: ActionIdUserScreenshare.enableOptimizeVideoForSharing,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdUserScreenshare.disableOptimizeVideoForSharing]: {
			name: 'Disable Optimize Video For Sharing (PRO)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/disableOptimizeVideo')
				const sendToCommand = {
					id: ActionIdUserScreenshare.disableOptimizeVideoForSharing,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdUserScreenshare.enableComputerSoundWhenSharing]: {
			name: 'Enable Computer Sound When Sharing (PRO)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/enableComputerSoundWhenSharing')
				const sendToCommand = {
					id: ActionIdUserScreenshare.enableComputerSoundWhenSharing,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdUserScreenshare.disableComputerSoundWhenSharing]: {
			name: 'Disable Computer Sound When Sharing (PRO)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/disableComputerSoundWhenSharing')
				const sendToCommand = {
					id: ActionIdUserScreenshare.disableComputerSoundWhenSharing,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdUserScreenshare.startScreenShareWithPrimaryScreen]: {
			name: 'Share Primary Screen',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/startScreenSharePrimary')
				const sendToCommand = {
					id: ActionIdUserScreenshare.startScreenShareWithPrimaryScreen,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdUserScreenshare.cycleSharedCameraToNextAvailable]: {
			name: 'Cycle Shared Camera To Next Available (PRO)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/shareNextCamera')
				const sendToCommand = {
					id: ActionIdUserScreenshare.cycleSharedCameraToNextAvailable,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdUserScreenshare.stopSharing]: {
			name: 'Stop Sharing',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/stopShare')
				const sendToCommand = {
					id: ActionIdUserScreenshare.stopSharing,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdUserScreenshare.startCameraShare]: {
			name: 'Start CameraShare (PRO)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/startCameraShare')
				const sendToCommand = {
					id: ActionIdUserScreenshare.startCameraShare,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdUserScreenshare.SetWindowPosition]: {
			name: 'Set Window Position  (PRO and MAC Only)',
			options: [options.userName, options.intX, options.intY],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/setWindowPosition', userName, select.single)
				if (command.isValidCommand) {
					command.args.push({ type: 'i', value: action.options.intX })
					command.args.push({ type: 'i', value: action.options.intY })
					const sendToCommand = {
						id: ActionIdUserScreenshare.SetWindowPosition,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserScreenshare.SetWindowSize]: {
			name: 'Set Window Size  (PRO and MAC Only)',
			options: [options.userName, options.intX, options.intY],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/setWindowSize', userName, select.single)
				if (command.isValidCommand) {
					command.args.push({ type: 'i', value: action.options.intX })
					command.args.push({ type: 'i', value: action.options.intY })
					const sendToCommand = {
						id: ActionIdUserScreenshare.SetWindowSize,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserScreenshare.startShareWithWindow]: {
			name: 'Share Window  (PRO and MAC Only)',
			options: [options.id],
			callback: (action): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/startWindowShare')
				command.args.push({ type: 'i', value: action.options.id })
				const sendToCommand = {
					id: ActionIdUserScreenshare.startShareWithWindow,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdUserScreenshare.startAudioShare]: {
			name: 'Start AudioShare (PRO and Windows)',
			options: [options.id],
			callback: (action): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/startAudioShare')
				command.args.push({ type: 'i', value: action.options.id })
				const sendToCommand = {
					id: ActionIdUserScreenshare.startAudioShare,
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
