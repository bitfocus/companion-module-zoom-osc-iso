import { ActionIdUserScreenshare } from '../actions/action-user-screenshare.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { CompanionPresetExt } from './preset-utils.js'
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
	setWindowXY = 'Set_Window_XY',
	setWindowSize = 'Set_Window_Size',
	hideSelfView = 'Hide_Self_View',
	showSelfView = 'Show_Self_View',
}

export function GetPresetsDeviceSettings(): { [id in PresetIdDeviceSettings]: CompanionPresetExt | undefined } {
	const presets: { [id in PresetIdDeviceSettings]: CompanionPresetExt | undefined } = {
		/**
		 * Devices & Settings Actions
		 */
		[PresetIdDeviceSettings.setCamera]: {
			type: 'button',
			category: 'Devices & Settings Actions',
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
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.setMic]: {
			type: 'button',
			category: 'Devices & Settings Actions',
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
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.setMicLevel]: {
			type: 'button',
			category: 'Devices & Settings Actions',
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
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.setSpeakerLevel]: {
			type: 'button',
			category: 'Devices & Settings Actions',
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
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.enableOriginalSound]: {
			type: 'button',
			category: 'Devices & Settings Actions',
			name: `Enable_Original_Sound`,
			style: {
				text: `Enable Original Sound`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSettings.enableOriginalSound,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.disableOriginalSound]: {
			type: 'button',
			category: 'Devices & Settings Actions',
			name: `Disable_Original_Sound`,
			style: {
				text: `Disable Original Sound`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSettings.disableOriginalSound,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.enableMirror]: {
			type: 'button',
			category: 'Devices & Settings Actions',
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
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.disableMirror]: {
			type: 'button',
			category: 'Devices & Settings Actions',
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
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.enableHD]: {
			type: 'button',
			category: 'Devices & Settings Actions',
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
			type: 'button',
			category: 'Devices & Settings Actions',
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
		[PresetIdDeviceSettings.setWindowXY]: {
			type: 'button',
			category: 'Devices & Settings Actions',
			name: `Set_Window_XY`,
			style: {
				text: `Set Window XY`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserScreenshare.SetWindowPosition,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.setWindowSize]: {
			type: 'button',
			category: 'Devices & Settings Actions',
			name: `Set_Window_Size`,
			style: {
				text: `Set Window Size`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserScreenshare.SetWindowSize,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdDeviceSettings.hideSelfView]: {
			type: 'button',
			category: 'Devices & Settings Actions',
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
			type: 'button',
			category: 'Devices & Settings Actions',
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
	return presets
}
