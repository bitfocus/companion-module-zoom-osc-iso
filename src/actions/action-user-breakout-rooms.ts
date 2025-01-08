import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt, options } from '../utils.js'
import { createCommand, select, sendActionCommand } from './action-utils.js'

export enum ActionIdUserBreakoutRooms {
	sendParticipantToBreakoutRoom = 'sendParticipantToBreakoutRoom',
	removeParticipantFromBreakoutRoom = 'removeParticipantFromBreakoutRoom',
	assignParticipantToBreakoutRoom = 'assignParticipantToBreakoutRoom',
	unassignParticipantFromBreakoutRoom = 'unassignParticipantFromBreakoutRoom',
	returnSelfToMainMeeting = 'returnSelfToMainMeeting',
}

export function GetActionsUserBreakoutRooms(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdUserBreakoutRooms]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdUserBreakoutRooms]: CompanionActionDefinition | undefined } = {
		[ActionIdUserBreakoutRooms.sendParticipantToBreakoutRoom]: {
			name: 'Send Participant To Breakout Room (PRO)',
			options: [options.userName, options.breakoutName],
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const command = createCommand(instance, '/sendToBreakout', userName, select.multi)
				if (command.isValidCommand) {
					command.args.push({ type: 's', value: action.options.breakoutName as string })
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
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
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
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const breakoutName = await instance.parseVariablesInString(action.options.breakoutName as string)
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
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
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
			callback: async (action): Promise<void> => {
				// type: 'User'
				const userName = await instance.parseVariablesInString(action.options.userName as string)
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
