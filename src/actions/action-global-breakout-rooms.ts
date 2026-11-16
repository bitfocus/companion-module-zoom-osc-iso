import type ModuleInstance from '../index.js'
import type { CompanionActionDefinitions } from '@companion-module/base'
import { options } from '../utils.js'
import { createCommand, sendActionCommand } from './action-utils.js'

export enum ActionIdGlobalBreakoutRooms {
	requestListOfBreakoutRooms = 'requestListOfBreakoutRooms',
	createBreakoutRoom = 'createBreakoutRoom',
	deleteBreakoutRoom = 'deleteBreakoutRoom',
	deleteAllBreakoutRooms = 'deleteAllBreakoutRooms',
	openBreakoutRooms = 'open_Breakout_Rooms',
	closeBreakoutRooms = 'closeBreakoutRooms',
	configureBreakoutRooms = 'configureBreakoutRooms',
	broadcastMessageToBreakoutRooms = 'broadcastMessageToBreakoutRooms',
}

export type ActionsSchemaGlobalBreakoutRooms = {
	[ActionIdGlobalBreakoutRooms.openBreakoutRooms]: { options: Record<string, never> }
	[ActionIdGlobalBreakoutRooms.closeBreakoutRooms]: { options: Record<string, never> }
	[ActionIdGlobalBreakoutRooms.deleteAllBreakoutRooms]: { options: Record<string, never> }
	[ActionIdGlobalBreakoutRooms.requestListOfBreakoutRooms]: { options: Record<string, never> }
	[ActionIdGlobalBreakoutRooms.configureBreakoutRooms]: {
		options: {
			postCloseSeconds: number
			allowChooseBreakout: number
			allowReturnAtWill: number
			autoMoveParticipants: number
			useTimer: number
			closeWithTimer: number
			breakoutDurrationSeconds: number
		}
	}
	[ActionIdGlobalBreakoutRooms.createBreakoutRoom]: { options: { name: string } }
	[ActionIdGlobalBreakoutRooms.deleteBreakoutRoom]: { options: { name: string } }
	[ActionIdGlobalBreakoutRooms.broadcastMessageToBreakoutRooms]: { options: { message: string } }
}

export function GetActionsGlobalBreakoutRooms(
	instance: ModuleInstance,
): CompanionActionDefinitions<ActionsSchemaGlobalBreakoutRooms> {
	const actions: CompanionActionDefinitions<ActionsSchemaGlobalBreakoutRooms> = {
		[ActionIdGlobalBreakoutRooms.openBreakoutRooms]: {
			name: 'Open Breakout Rooms (PRO)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/openBreakouts')
				const sendToCommand = {
					id: ActionIdGlobalBreakoutRooms.openBreakoutRooms,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalBreakoutRooms.closeBreakoutRooms]: {
			name: 'Close Breakout Rooms (PRO)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/closeBreakouts')
				const sendToCommand = {
					id: ActionIdGlobalBreakoutRooms.closeBreakoutRooms,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalBreakoutRooms.deleteAllBreakoutRooms]: {
			name: 'Delete All Breakout Rooms (PRO)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/deleteAllBreakouts')
				const sendToCommand = {
					id: ActionIdGlobalBreakoutRooms.deleteAllBreakoutRooms,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalBreakoutRooms.requestListOfBreakoutRooms]: {
			name: 'Request list of Breakout Rooms (PRO)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/listBreakouts')
				const sendToCommand = {
					id: ActionIdGlobalBreakoutRooms.requestListOfBreakoutRooms,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalBreakoutRooms.configureBreakoutRooms]: {
			name: 'Configure Breakout Rooms (PRO)',
			options: [
				options.postCloseSeconds,
				options.allowChooseBreakout,
				options.allowReturnAtWill,
				options.autoMoveParticipants,
				options.useTimer,
				options.closeWithTimer,
				options.breakoutDurrationSeconds,
			],
			callback: (action): void => {
				// type: 'Special'
				const command = createCommand(instance, '/configureBreakouts')
				command.args.push({ type: 'i', value: action.options.postCloseSeconds })
				command.args.push({ type: 'i', value: action.options.allowChooseBreakout })
				command.args.push({ type: 'i', value: action.options.allowReturnAtWill })
				command.args.push({ type: 'i', value: action.options.autoMoveParticipants })
				command.args.push({ type: 'i', value: action.options.useTimer })
				command.args.push({ type: 'i', value: action.options.closeWithTimer })
				command.args.push({ type: 'i', value: action.options.breakoutDurrationSeconds })
				const sendToCommand = {
					id: ActionIdGlobalBreakoutRooms.configureBreakoutRooms,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalBreakoutRooms.createBreakoutRoom]: {
			name: 'Create Breakout Room (PRO)',
			options: [options.name],
			callback: (action): void => {
				// type: 'Global'
				const command = createCommand(instance, '/createBreakout')
				const newName = action.options.name
				command.args.push({ type: 's', value: newName })
				const sendToCommand = {
					id: ActionIdGlobalBreakoutRooms.createBreakoutRoom,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalBreakoutRooms.deleteBreakoutRoom]: {
			name: 'Delete Breakout Room (PRO)',
			options: [options.name],
			callback: (action): void => {
				// type: 'Global'
				const command = createCommand(instance, '/deleteBreakout')
				const newName = action.options.name
				command.args.push({ type: 's', value: newName })
				const sendToCommand = {
					id: ActionIdGlobalBreakoutRooms.deleteBreakoutRoom,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalBreakoutRooms.broadcastMessageToBreakoutRooms]: {
			name: 'Broadcast Message To Breakout Rooms (PRO)',
			options: [options.message],
			callback: (action): void => {
				// type: 'Global'
				const command = createCommand(instance, '/broadcastToBreakouts')
				command.args.push({ type: 's', value: action.options.message })
				const sendToCommand = {
					id: ActionIdGlobalBreakoutRooms.broadcastMessageToBreakoutRooms,
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
