import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type { ModuleSchema } from '../index.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { presetImages } from '../images-presets.js'
import { ActionIdUserSettings } from '../actions/action-user-settings.js'

export enum PresetIdDeviceSettings {
	setCamera = 'Set_Camera',
	setMic = 'Set_Mic',
	setMicLevel = 'Set_Mic_Level',
	setSpeakerLevel = 'Set_Speaker_Level',
	enableOriginalSound = 'Enable_Original_Sound',
	disableOriginalSound = 'Disable_Original_Sound',
	enableMirror = 'Enable_Mirror',
	disableMirror = 'Disable_Mirror',
	enableHD = 'Enable_HD',
	disableHD = 'Disable_HD',
	hideSelfView = 'Hide_Self_View',
	showSelfView = 'Show_Self_View',
}

export function GetPresetsDeviceSettings(): {
	section: CompanionPresetSection<ModuleSchema>
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	const presets: { [id in PresetIdDeviceSettings]: CompanionPresetDefinitions<ModuleSchema>[string] } = {
		/**
		 * Devices & Settings Actions
		 */
		[PresetIdDeviceSettings.setCamera]: {
			type: 'simple',
			name: `Set_Camera`,
			style: {
				text: `Set Camera`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSettings.setCameraDevice,
							options: { userName: '', id: 0 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.setMic]: {
			type: 'simple',
			name: `Set_Mic`,
			style: {
				text: `Set Mic`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSettings.setMicDevice,
							options: { userName: '', id: 0 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.setMicLevel]: {
			type: 'simple',
			name: `Set_Mic_Level`,
			style: {
				text: `Set Mic Level`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSettings.setMicLevel,
							options: { level: 0 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.setSpeakerLevel]: {
			type: 'simple',
			name: `Set_Speaker_Level`,
			style: {
				text: `Set Speaker Level`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSettings.setSpeakerVolume,
							options: { userName: '', level: 0 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.enableOriginalSound]: {
			type: 'simple',
			name: `Enable_Original_Sound`,
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.enableOriginalSound,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSettings.enableOriginalSound,
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.disableOriginalSound]: {
			type: 'simple',
			name: `Disable_Original_Sound`,
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.disableOriginalSound,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSettings.disableOriginalSound,
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.enableMirror]: {
			type: 'simple',
			name: `Enable_Mirror`,
			style: {
				text: `Enable Mirror`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSettings.enableMirrorVideo,
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.disableMirror]: {
			type: 'simple',
			name: `Disable_Mirror`,
			style: {
				text: `Disable Mirror`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSettings.disableMirrorVideo,
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.enableHD]: {
			type: 'simple',
			name: `Enable_HD`,
			style: {
				text: `Enable HD`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSettings.enableHDVideo,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.disableHD]: {
			type: 'simple',
			name: `Disable_HD`,
			style: {
				text: `Disable HD`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSettings.disableHDVideo,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.hideSelfView]: {
			type: 'simple',
			name: `Hide_Self_View`,
			style: {
				text: `Hide Self View`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSettings.hideSelfView,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.showSelfView]: {
			type: 'simple',
			name: `Show_Self_View`,
			style: {
				text: `Show Self View`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSettings.showSelfView,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
	}
	const section: CompanionPresetSection<ModuleSchema> = {
		id: 'devices_settings',
		name: 'Devices & Settings Actions',
		definitions: Object.values(PresetIdDeviceSettings),
	}

	return { section, presets }
}
