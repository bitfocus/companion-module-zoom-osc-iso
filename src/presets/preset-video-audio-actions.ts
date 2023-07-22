import { ActionIdUserVideoMic } from '../actions/action-user-video-mic'
import { colorBlack, colorLightGray } from '../utils'
import { CompanionPresetDefinitionsExt } from './preset-utils'
import { ActionIdGlobal } from '../actions/action-global'

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
						actionId: ActionIdUserVideoMic.turnVideoOn,
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
						actionId: ActionIdUserVideoMic.turnVideoOff,
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
						actionId: ActionIdUserVideoMic.toggleVideoState,
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
						actionId: ActionIdUserVideoMic.mute,
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
						actionId: ActionIdUserVideoMic.unmute,
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
						actionId: ActionIdGlobal.muteAll,
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
						actionId: ActionIdGlobal.unmuteAll,
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
						actionId: ActionIdGlobal.muteAllExcept,
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
						actionId: ActionIdGlobal.muteAllExceptHost,
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
						actionId: ActionIdUserVideoMic.toggleMuteState,
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
