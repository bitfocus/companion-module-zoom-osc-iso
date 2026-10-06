import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type { ModuleSchema } from '../index.js'
import { ActionIdUserScreenshare } from '../actions/action-user-screenshare.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { presetImages } from '../images-presets.js'

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

export function GetPresetsSharing(): {
	section: CompanionPresetSection<ModuleSchema>
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	const presets: { [id in PresetIdSharing]: CompanionPresetDefinitions<ModuleSchema>[string] } = {
		/**
		 * Sharing Actions
		 */
		[PresetIdSharing.screenShare]: {
			type: 'simple',
			name: `Screen_Share`,
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.shareScreen,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserScreenshare.startScreenShare,
							options: { id: 0 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdSharing.stopShare]: {
			type: 'simple',
			name: `Stop_Share`,
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.shareStop,
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
			type: 'simple',
			name: `Screen_Share_Primary`,
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.shareScreen,
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
			type: 'simple',
			name: `Share_Window`,
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.shareWindow,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserScreenshare.startShareWithWindow,
							options: { id: 0 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdSharing.shareCamera]: {
			type: 'simple',
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
			type: 'simple',
			name: `Share_Audio`,
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.shareAudioOnly,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserScreenshare.startAudioShare,
							options: { id: 0 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdSharing.cycleSharedCamera]: {
			type: 'simple',
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
			type: 'simple',
			name: `Enable Optimize for Video`,
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.shareEnableOptimize,
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
			type: 'simple',
			name: `Disable_Optimize_for_Video`,
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.shareDisableOptimize,
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
	const section: CompanionPresetSection<ModuleSchema> = {
		id: 'sharing',
		name: 'Sharing Actions',
		definitions: Object.values(PresetIdSharing),
	}

	return { section, presets }
}
