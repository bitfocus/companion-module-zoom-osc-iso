import { ActionIdUserScreenshare } from '../actions/action-user-screenshare.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { CompanionPresetExt } from './preset-utils.js'

export enum PresetIdSharing {
	screenShare = 'Screen_Share',
	stopShare = 'Stop_Share',
	screenSharePrimary = 'Screen_Share_Primary',
	shareWindow = 'Share_Window',
	shareCamera = 'Share_Camera',
	shareAudio = 'Share_Audio',
	cycleSharedCamera = 'Cycle_Shared_Camera',
	enableOptimizeForVideo = 'Enable Optimize for Video',
	disableOptimizeForVideo = 'Disable_Optimize_for_Video',
}

export function GetPresetsSharing(): { [id in PresetIdSharing]: CompanionPresetExt | undefined } {
	const presets: { [id in PresetIdSharing]: CompanionPresetExt | undefined } = {
		/**
		 * Sharing Actions
		 */
		[PresetIdSharing.screenShare]: {
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
		},
		[PresetIdSharing.stopShare]: {
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
		},
		[PresetIdSharing.screenSharePrimary]: {
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
		},
		[PresetIdSharing.shareWindow]: {
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
		},
		[PresetIdSharing.shareCamera]: {
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
		},
		[PresetIdSharing.shareAudio]: {
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
		},
		[PresetIdSharing.cycleSharedCamera]: {
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
		},
		[PresetIdSharing.enableOptimizeForVideo]: {
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
		},
		[PresetIdSharing.disableOptimizeForVideo]: {
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
		},
	}
	return presets
}
