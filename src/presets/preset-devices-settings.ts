import { ActionId } from '../actions'
import { colorBlack, colorLightGray } from '../utils'
import { CompanionPresetDefinitionsExt } from './preset-utils'

export function GetPresetsDeviceSettings(): CompanionPresetDefinitionsExt {
	const presets: CompanionPresetDefinitionsExt = {}

	/**
	 * Devices & Settings Actions
	 */
	presets[`Set_Camera`] = {
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
						actionId: ActionId.setCameraDevice,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Set_Mic`] = {
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
						actionId: ActionId.setMicDevice,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Set_Camera`] = {
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
						actionId: ActionId.setCameraDevice,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Set_Mic_Level`] = {
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
						actionId: ActionId.setMicLevel,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Set_Speaker_Level`] = {
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
						actionId: ActionId.setSpeakerVolume,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Enable_Original_Sound`] = {
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
						actionId: ActionId.enableOriginalSound,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Disable_Original_Sound`] = {
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
						actionId: ActionId.disableOriginalSound,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Enable_Mirror`] = {
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
						actionId: ActionId.enableMirrorVideo,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Disable_Mirror`] = {
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
						actionId: ActionId.disableMirrorVideo,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Enable_HD`] = {
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
						actionId: ActionId.enableHDVideo,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Disable_HD`] = {
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
						actionId: ActionId.disableHDVideo,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Set_Window_XY`] = {
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
						actionId: ActionId.SetWindowPosition,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Set_Window_Size`] = {
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
						actionId: ActionId.SetWindowSize,
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
