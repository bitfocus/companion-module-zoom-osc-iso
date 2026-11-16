import type ModuleInstance from '../index.js'
import type { CompanionActionDefinitions } from '@companion-module/base'
import { options } from '../utils.js'
import { createCommand, select, sendActionCommand } from './action-utils.js'

export enum ActionIdUserBreakoutRooms {
	sendParticipantToBreakoutRoom = 'sendParticipantToBreakoutRoom',
	removeParticipantFromBreakoutRoom = 'removeParticipantFromBreakoutRoom',
	assignParticipantToBreakoutRoom = 'assignParticipantToBreakoutRoom',
	unassignParticipantFromBreakoutRoom = 'unassignParticipantFromBreakoutRoom',
	returnSelfToMainMeeting = 'returnSelfToMainMeeting',
}

export type ActionsSchemaUserBreakoutRooms = {
	[ActionIdUserBreakoutRooms.sendParticipantToBreakoutRoom]: { options: { userName: string; breakoutName: string } }
	[ActionIdUserBreakoutRooms.removeParticipantFromBreakoutRoom]: { options: { userName: string } }
	[ActionIdUserBreakoutRooms.assignParticipantToBreakoutRoom]: { options: { userName: string; breakoutName: string } }
	[ActionIdUserBreakoutRooms.unassignParticipantFromBreakoutRoom]: { options: { userName: string } }
	[ActionIdUserBreakoutRooms.returnSelfToMainMeeting]: { options: { userName: string } }
}

export function GetActionsUserBreakoutRooms(
	instance: ModuleInstance,
): CompanionActionDefinitions<ActionsSchemaUserBreakoutRooms> {
	const actions: CompanionActionDefinitions<ActionsSchemaUserBreakoutRooms> = {
		[ActionIdUserBreakoutRooms.sendParticipantToBreakoutRoom]: {
			name: 'Send Participant To Breakout Room (PRO)',
			options: [options.userName, options.breakoutName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const command = createCommand(instance, '/sendToBreakout', userName, select.multi)
				if (command.isValidCommand) {
					command.args.push({ type: 's', value: action.options.breakoutName })
					const sendToCommand = {
						id: ActionIdUserBreakoutRooms.sendParticipantToBreakoutRoom,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserBreakoutRooms.removeParticipantFromBreakoutRoom]: {
			name: 'Remove Participant From Breakout Room (PRO)',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const command = createCommand(instance, '/removeFromBreakout', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserBreakoutRooms.removeParticipantFromBreakoutRoom,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserBreakoutRooms.assignParticipantToBreakoutRoom]: {
			name: 'Assign Participant To Breakout Room (PRO)',
			options: [options.userName, options.breakoutName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const breakoutName = action.options.breakoutName
				const command = createCommand(instance, '/assignToBreakout', userName, select.multi)
				if (command.isValidCommand) {
					command.args.push({ type: 's', value: breakoutName })
					const sendToCommand = {
						id: ActionIdUserBreakoutRooms.assignParticipantToBreakoutRoom,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserBreakoutRooms.unassignParticipantFromBreakoutRoom]: {
			name: 'Unassign Participant From Breakout Room (PRO)',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const command = createCommand(instance, '/unassignFromBreakout', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserBreakoutRooms.unassignParticipantFromBreakoutRoom,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdUserBreakoutRooms.returnSelfToMainMeeting]: {
			name: 'Return Self To Main Meeting',
			options: [options.userName],
			callback: (action): void => {
				// type: 'User'
				const userName = action.options.userName
				const command = createCommand(instance, '/returnToMainMeeting', userName, select.multi)
				if (command.isValidCommand) {
					const sendToCommand = {
						id: ActionIdUserBreakoutRooms.returnSelfToMainMeeting,
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
