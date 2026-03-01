import { ActionIdUserRolesAndAction } from '../actions/action-user-roles-action.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { CompanionPresetExt } from './preset-utils.js'
import { ActionIdGlobalRecording } from '../actions/action-global-recording.js'

export enum PresetIdRecording {
	startLocalRecording = 'Start_Local_Recording',
	pauseLocalRecording = 'Pause_Local_Recording',
	resumeLocalRecording = 'Resume_Local_Recording',
	stopLocalRecording = 'Stop_Local_Recording',
	startCloudRecording = 'Start_Cloud_Recording',
	pauseCloudRecording = 'Pause_Cloud_Recording',
	resumeCloudRecording = 'Resume_Cloud_Recording',
	stopCloudRecording = 'Stop_Cloud_Recording',
	allowToLocalRecord = 'Allow_to_Local_Record',
	disallowToLocalRecord = 'Disallow_to_Local_Record',
}

export function GetPresetsRecording(): { [id in PresetIdRecording]: CompanionPresetExt | undefined } {
	const presets: { [id in PresetIdRecording]: CompanionPresetExt | undefined } = {
		/**
		 * Recording Actions
		 */
		[PresetIdRecording.startLocalRecording]: {
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
		},

		[PresetIdRecording.pauseLocalRecording]: {
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
		},

		[PresetIdRecording.resumeLocalRecording]: {
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
		},

		[PresetIdRecording.stopLocalRecording]: {
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
		},

		[PresetIdRecording.startCloudRecording]: {
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
		},

		[PresetIdRecording.pauseCloudRecording]: {
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
		},

		[PresetIdRecording.resumeCloudRecording]: {
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
		},

		[PresetIdRecording.stopCloudRecording]: {
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
		},

		[PresetIdRecording.allowToLocalRecord]: {
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
		},

		[PresetIdRecording.disallowToLocalRecord]: {
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
		},
	}

	return presets
}
