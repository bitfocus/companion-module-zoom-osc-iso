import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type { ModuleSchema } from '../index.js'
import { ActionIdUserRolesAndAction } from '../actions/action-user-roles-action.js'
import { colorBlack, colorLightGray } from '../utils.js'
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

export function GetPresetsRecording(): {
	section: CompanionPresetSection<ModuleSchema>
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	const presets: { [id in PresetIdRecording]: CompanionPresetDefinitions<ModuleSchema>[string] } = {
		/**
		 * Recording Actions
		 */
		[PresetIdRecording.startLocalRecording]: {
			type: 'simple',
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
			type: 'simple',
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
			type: 'simple',
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
			type: 'simple',
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
			type: 'simple',
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
			type: 'simple',
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
			type: 'simple',
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
			type: 'simple',
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
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},

		[PresetIdRecording.disallowToLocalRecord]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
	}

	const section: CompanionPresetSection<ModuleSchema> = {
		id: 'recording',
		name: 'Recording Actions',
		definitions: Object.values(PresetIdRecording),
	}

	return { section, presets }
}
