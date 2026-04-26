import { ActionIdGlobalWaitingRoomsAndZak } from '../actions/action-global-waitingrooms-and-zak.js'
import { ActionIdGlobal } from '../actions/action-global.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { CompanionPresetExt } from './preset-utils.js'

export enum PresetIdJoinLeaveEnd {
	joinMeeting = 'Join_Meeting',
	leaveMeeting = 'Leave_Meeting',
	endMeeting = 'End_Meeting',
	zakJoinMeeting = 'ZAK_Join_Meeting',
	zakStartMeeting = 'ZAK_Start_Meeting',
}

export function GetPresetsJoinLeaveEnd(): { [id in PresetIdJoinLeaveEnd]: CompanionPresetExt | undefined } {
	const presets: { [id in PresetIdJoinLeaveEnd]: CompanionPresetExt | undefined } = {
		/**
		 * Join/Leave/End Actions
		 */
		[PresetIdJoinLeaveEnd.joinMeeting]: {
			type: 'button',
			category: 'Join/Leave/End Actions',
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
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdJoinLeaveEnd.leaveMeeting]: {
			type: 'button',
			category: 'Join/Leave/End Actions',
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
			type: 'button',
			category: 'Join/Leave/End Actions',
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
			type: 'button',
			category: 'Join/Leave/End Actions',
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
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdJoinLeaveEnd.zakStartMeeting]: {
			type: 'button',
			category: 'Join/Leave/End Actions',
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
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
	}

	return presets
}
