import { ActionIdUserBreakoutRooms } from '../actions/action-user-breakout-rooms.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { CompanionPresetDefinitionsExt } from './preset-utils.js'
import { ActionIdGlobalBreakoutRooms } from '../actions/action-global-breakout-rooms.js'

export function GetPresetsBreakout(): CompanionPresetDefinitionsExt {
	const presets: CompanionPresetDefinitionsExt = {}

	/**
	 * Breakout Actions
	 */
	presets[`Send_Participant_To_BreakoutRoom`] = {
		type: 'button',
		category: 'Breakout Actions',
		name: `Send_Participant_To_BreakoutRoom`,
		style: {
			text: `Send To Breakout Room`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdUserBreakoutRooms.sendParticipantToBreakoutRoom,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Create_Breakout_Room`] = {
		type: 'button',
		category: 'Breakout Actions',
		name: `Create_Breakout_Room`,
		style: {
			text: `Create Breakout Room`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdGlobalBreakoutRooms.createBreakoutRoom,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Configure_Breakouts`] = {
		type: 'button',
		category: 'Breakout Actions',
		name: `Configure_Breakouts`,
		style: {
			text: `Configure Breakouts`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdGlobalBreakoutRooms.configureBreakoutRooms,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Delete_Breakout_Room`] = {
		type: 'button',
		category: 'Breakout Actions',
		name: `Delete_Breakout_Room`,
		style: {
			text: `Delete Breakout Room`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdGlobalBreakoutRooms.deleteBreakoutRoom,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Open_Breakouts`] = {
		type: 'button',
		category: 'Breakout Actions',
		name: `Open_Breakouts`,
		style: {
			text: `Open Breakouts`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdGlobalBreakoutRooms.openBreakoutRooms,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`Close_Breakouts`] = {
		type: 'button',
		category: 'Breakout Actions',
		name: `Close_Breakouts`,
		style: {
			text: `Close Breakouts`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdGlobalBreakoutRooms.closeBreakoutRooms,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Delete_All_Breakouts`] = {
		type: 'button',
		category: 'Breakout Actions',
		name: `Delete_All_Breakouts`,
		style: {
			text: `Delete All Breakouts`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdGlobalBreakoutRooms.deleteAllBreakoutRooms,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Return_Self_to_Main_Room`] = {
		type: 'button',
		category: 'Breakout Actions',
		name: `Return_Self_to_Main_Room`,
		style: {
			text: `Return Self to Main Room`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdUserBreakoutRooms.returnSelfToMainMeeting,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Broadcast_Message_to_Breakouts`] = {
		type: 'button',
		category: 'Breakout Actions',
		name: `Broadcast_Message_to_Breakouts`,
		style: {
			text: `Broadcast Message to Breakouts`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdGlobalBreakoutRooms.broadcastMessageToBreakoutRooms,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	return presets
}
