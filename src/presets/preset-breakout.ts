import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type { ModuleSchema } from '../index.js'
import { ActionIdUserBreakoutRooms } from '../actions/action-user-breakout-rooms.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { ActionIdGlobalBreakoutRooms } from '../actions/action-global-breakout-rooms.js'

export enum PresetIdBreakout {
	sendParticipantToBreakoutRoom = 'Send_Participant_To_BreakoutRoom',
	createBreakoutRoom = 'Create_Breakout_Room',
	configureBreakouts = 'Configure_Breakouts',
	deleteBreakoutRoom = 'Delete_Breakout_Room',
	openBreakouts = 'Open_Breakouts',
	closeBreakouts = 'Close_Breakouts',
	deleteAllBreakouts = 'Delete_All_Breakouts',
	returnSelfToMainRoom = 'Return_Self_to_Main_Room',
	broadcastMessageToBreakouts = 'Broadcast_Message_to_Breakouts',
}

export function GetPresetsBreakout(): {
	section: CompanionPresetSection<ModuleSchema>
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	const presets: { [id in PresetIdBreakout]: CompanionPresetDefinitions<ModuleSchema>[string] } = {
		/**
		 * Breakout Actions
		 */
		[PresetIdBreakout.sendParticipantToBreakoutRoom]: {
			type: 'simple',
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
							options: { userName: '', breakoutName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdBreakout.createBreakoutRoom]: {
			type: 'simple',
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
							options: { name: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdBreakout.configureBreakouts]: {
			type: 'simple',
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
							options: {
								postCloseSeconds: 0,
								allowChooseBreakout: 0,
								allowReturnAtWill: 0,
								autoMoveParticipants: 0,
								useTimer: 0,
								closeWithTimer: 0,
								breakoutDurrationSeconds: 0,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdBreakout.deleteBreakoutRoom]: {
			type: 'simple',
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
							options: { name: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdBreakout.openBreakouts]: {
			type: 'simple',
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
		},
		[PresetIdBreakout.closeBreakouts]: {
			type: 'simple',
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
		},
		[PresetIdBreakout.deleteAllBreakouts]: {
			type: 'simple',
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
		},
		[PresetIdBreakout.returnSelfToMainRoom]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdBreakout.broadcastMessageToBreakouts]: {
			type: 'simple',
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
							options: { message: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
	}
	const section: CompanionPresetSection<ModuleSchema> = {
		id: 'breakout',
		name: 'Breakout Actions',
		definitions: Object.values(PresetIdBreakout),
	}

	return { section, presets }
}
