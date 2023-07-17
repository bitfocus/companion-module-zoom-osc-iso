import { ActionId } from '../actions'
import { colorBlack, colorLightGray } from '../utils'
import { CompanionPresetDefinitionsExt } from './preset-utils'

export function GetPresetsJoinLeaveEnd(): CompanionPresetDefinitionsExt {
	const presets: CompanionPresetDefinitionsExt = {}

	/**
	 * Join/Leave/End Actions
	 */
	presets[`Join_Meeting`] = {
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
						actionId: ActionId.joinMeeting,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Leave_Meeting`] = {
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
						actionId: ActionId.leaveMeeting,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`End_Meeting`] = {
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
						actionId: ActionId.endMeeting,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`ZAK_Join_Meeting`] = {
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
						actionId: ActionId.ZAKJoinMeeting,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`ZAK_Start_Meeting`] = {
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
						actionId: ActionId.ZAKStartMeeting,
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
