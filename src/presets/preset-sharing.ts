import { ActionIdUserScreenshare } from '../actions/action-user-screenshare.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { CompanionPresetDefinitionsExt } from './preset-utils.js'

export function GetPresetsSharing(): CompanionPresetDefinitionsExt {
	const presets: CompanionPresetDefinitionsExt = {}

	/**
	 * Sharing Actions
	 */
	presets[`Screen_Share`] = {
		type: 'button',
		category: 'Sharing Actions',
		name: `Screen_Share`,
		style: {
			text: `Screen Share`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdUserScreenshare.startScreenShare,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Stop_Share`] = {
		type: 'button',
		category: 'Sharing Actions',
		name: `Stop_Share`,
		style: {
			text: `Stop Share`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdUserScreenshare.stopSharing,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Screen_Share_Primary`] = {
		type: 'button',
		category: 'Sharing Actions',
		name: `Screen_Share_Primary`,
		style: {
			text: `Screen Share Primary`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdUserScreenshare.startScreenShareWithPrimaryScreen,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Share_Window`] = {
		type: 'button',
		category: 'Sharing Actions',
		name: `Share_Window`,
		style: {
			text: `Share Window`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdUserScreenshare.startShareWithWindow,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Share_Camera`] = {
		type: 'button',
		category: 'Sharing Actions',
		name: `Share_Camera`,
		style: {
			text: `Share Camera`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdUserScreenshare.startCameraShare,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Share_Audio`] = {
		type: 'button',
		category: 'Sharing Actions',
		name: `Share_Audio`,
		style: {
			text: `Share Audio`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdUserScreenshare.startAudioShare,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Cycle_Shared_Camera`] = {
		type: 'button',
		category: 'Sharing Actions',
		name: `Cycle_Shared_Camera`,
		style: {
			text: `Cycle Shared Camera`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdUserScreenshare.cycleSharedCameraToNextAvailable,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Enable Optimize for Video`] = {
		type: 'button',
		category: 'Sharing Actions',
		name: `Enable Optimize for Video`,
		style: {
			text: `Enable Optimize for Video`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdUserScreenshare.enableOptimizeVideoForSharing,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Disable_Optimize_for_Video`] = {
		type: 'button',
		category: 'Sharing Actions',
		name: `Disable_Optimize_for_Video`,
		style: {
			text: `Disable Optimize for Video`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdUserScreenshare.disableOptimizeVideoForSharing,
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
