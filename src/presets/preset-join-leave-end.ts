import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type { ModuleSchema } from '../index.js'
import { ActionIdGlobalWaitingRoomsAndZak } from '../actions/action-global-waitingrooms-and-zak.js'
import { ActionIdGlobal } from '../actions/action-global.js'
import { colorBlack, colorLightGray } from '../utils.js'

export enum PresetIdJoinLeaveEnd {
	joinMeeting = 'Join_Meeting',
	leaveMeeting = 'Leave_Meeting',
	endMeeting = 'End_Meeting',
	zakJoinMeeting = 'ZAK_Join_Meeting',
	zakStartMeeting = 'ZAK_Start_Meeting',
}

export function GetPresetsJoinLeaveEnd(): {
	section: CompanionPresetSection<ModuleSchema>
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	const presets: { [id in PresetIdJoinLeaveEnd]: CompanionPresetDefinitions<ModuleSchema>[string] } = {
		/**
		 * Join/Leave/End Actions
		 */
		[PresetIdJoinLeaveEnd.joinMeeting]: {
			type: 'simple',
			name: `Join_Meeting`,
			style: {
				text: `Join Meeting`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobal.joinMeeting,
							options: { meetingID: '', password: '', name: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdJoinLeaveEnd.leaveMeeting]: {
			type: 'simple',
			name: `Leave_Meeting`,
			style: {
				text: `Leave Meeting`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobal.leaveMeeting,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdJoinLeaveEnd.endMeeting]: {
			type: 'simple',
			name: `End_Meeting`,
			style: {
				text: `End Meeting`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobal.endMeeting,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdJoinLeaveEnd.zakJoinMeeting]: {
			type: 'simple',
			name: `ZAK_Join_Meeting`,
			style: {
				text: `ZAK Join Meeting`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobalWaitingRoomsAndZak.ZAKJoinMeeting,
							options: { zak: '', meetingID: '', name: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdJoinLeaveEnd.zakStartMeeting]: {
			type: 'simple',
			name: `ZAK_Start_Meeting`,
			style: {
				text: `ZAK Start Meeting`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobalWaitingRoomsAndZak.ZAKStartMeeting,
							options: { zak: '', meetingID: '', name: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
	}

	const section: CompanionPresetSection<ModuleSchema> = {
		id: 'join_leave_end',
		name: 'Join/Leave/End Actions',
		definitions: [
			{
				id: 'join_leave_end_buttons',
				type: 'simple',
				name: 'Join/Leave/End Actions',
				presets: Object.values(PresetIdJoinLeaveEnd),
			},
		],
	}

	return { section, presets }
}
