import { ActionId } from '../actions'
import { colorBlack, colorLightGray } from '../utils'
import { CompanionPresetDefinitionsExt } from './preset-utils'

export function GetPresetsRecording(): CompanionPresetDefinitionsExt {
	const presets: CompanionPresetDefinitionsExt = {}

	/**
	 * Recording Actions
	 */
	presets[`Start_Local_Recording`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Start_Local_Recording`,
		style: {
			text: `Start Local Recording`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.startLocalRecording,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Pause_Local_Recording`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Pause_Local_Recording`,
		style: {
			text: `Pause Local Recording`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.pauseLocalRecording,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Resume_Local_Recording`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Resume_Local_Recording`,
		style: {
			text: `Resume Local Recording`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.resumeLocalRecording,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Stop_Local_Recording`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Stop_Local_Recording`,
		style: {
			text: `Stop Local Recording`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.stopLocalRecording,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Start_Cloud_Recording`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Start_Cloud_Recording`,
		style: {
			text: `Start Cloud Recording`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.startCloudRecording,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Pause_Cloud_Recording`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Pause_Cloud_Recording`,
		style: {
			text: `Pause Cloud Recording`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.pauseCloudRecording,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Resume_Cloud_Recording`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Resume_Cloud_Recording`,
		style: {
			text: `Resume Cloud Recording`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.resumeCloudRecording,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Stop_Cloud_Recording`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Stop_Cloud_Recording`,
		style: {
			text: `Stop Cloud Recording`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.stopCloudRecording,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Allow_to_Local_Record`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Allow_to_Local_Record`,
		style: {
			text: `Allow to Local Record`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.allowToRecord,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Disallow_to_Local_Record`] = {
		type: 'button',
		category: 'Recording Actions',
		name: `Disallow_to_Local_Record`,
		style: {
			text: `Disallow to Local Record`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.disallowToRecord,
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
