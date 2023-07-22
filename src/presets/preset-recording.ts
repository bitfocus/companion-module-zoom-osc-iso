import { ActionIdUserRolesAndAction } from '../actions/action-user-roles-action'
import { colorBlack, colorLightGray } from '../utils'
import { CompanionPresetDefinitionsExt } from './preset-utils'
import { ActionIdGlobalRecording } from '../actions/action-global-recording'

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
						actionId: ActionIdGlobalRecording.startLocalRecording,
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
						actionId: ActionIdGlobalRecording.pauseLocalRecording,
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
						actionId: ActionIdGlobalRecording.resumeLocalRecording,
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
						actionId: ActionIdGlobalRecording.stopLocalRecording,
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
						actionId: ActionIdGlobalRecording.startCloudRecording,
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
						actionId: ActionIdGlobalRecording.pauseCloudRecording,
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
						actionId: ActionIdGlobalRecording.resumeCloudRecording,
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
						actionId: ActionIdGlobalRecording.stopCloudRecording,
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
						actionId: ActionIdUserRolesAndAction.allowToRecord,
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
						actionId: ActionIdUserRolesAndAction.disallowToRecord,
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
