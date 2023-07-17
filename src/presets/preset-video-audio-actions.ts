import { ActionId } from '../actions'
import { colorBlack, colorLightGray } from '../utils'
import { CompanionPresetDefinitionsExt } from './preset-utils'

export function GetPresetsVideoAudioActions(): CompanionPresetDefinitionsExt {
	const presets: CompanionPresetDefinitionsExt = {}

	/**
	 * Video/Audio Actions
	 */
	presets['Video_On'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'Video_On',
		style: {
			text: 'Turn Video On',
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.turnVideoOn,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['Video_Off'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'Video_Off',
		style: {
			text: 'Turn Video Off',
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.turnVideoOff,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['Toggle_Video'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'Toggle_Video',
		style: {
			text: 'Toggle Video State',
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.toggleVideoState,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['Mute'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'Mute',
		style: {
			text: 'Mute',
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.mute,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['Unmute'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'Mute_All',
		style: {
			text: 'Unmute',
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.unmute,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['Mute_All'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'Mute_All',
		style: {
			text: 'Mute all',
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.muteAll,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['Unmute_All'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'Unmute_All',
		style: {
			text: 'Unmute all',
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.unmuteAll,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['mute_all_except'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'mute_all_except',
		style: {
			text: 'Mute All Except',
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.muteAllExcept,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['mute_all_except_hosts'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'Mute all except Hosts',
		style: {
			text: 'Mute All Except Hosts',
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.muteAllExceptHost,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['Toggle_mute'] = {
		type: 'button',
		category: 'Video/Audio Actions',
		name: 'Toggle_mute',
		style: {
			text: 'Toggle mute',
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.toggleMuteState,
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
