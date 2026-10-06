import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type { ModuleSchema } from '../index.js'
import { ActionIdUserVideoMic } from '../actions/action-user-video-mic.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { presetImages } from '../images-presets.js'
import { ActionIdGlobal } from '../actions/action-global.js'

export enum PresetIdVideoAudioActions {
	videoOn = 'Video_On',
	videoOff = 'Video_Off',
	toggleVideo = 'Toggle_Video',
	mute = 'Mute',
	unmute = 'Unmute',
	muteAll = 'Mute_All',
	unmuteAll = 'Unmute_All',
	muteAllExcept = 'mute_all_except',
	muteAllExceptHosts = 'mute_all_except_hosts',
	muteAllExceptSpotlight = 'mute_all_except_spotlight',
	toggleMute = 'Toggle_mute',
}

export function GetPresetsVideoAudioActions(): {
	section: CompanionPresetSection<ModuleSchema>
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	const presets: { [id in PresetIdVideoAudioActions]: CompanionPresetDefinitions<ModuleSchema>[string] } = {
		/**
		 * Video/Audio Actions
		 */
		[PresetIdVideoAudioActions.videoOn]: {
			type: 'simple',
			name: 'Video_On',
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.videoOnRequest,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserVideoMic.turnVideoOn,
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdVideoAudioActions.videoOff]: {
			type: 'simple',
			name: 'Video_Off',
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.videoOff,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserVideoMic.turnVideoOff,
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdVideoAudioActions.toggleVideo]: {
			type: 'simple',
			name: 'Toggle_Video',
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.toggleVideo,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserVideoMic.toggleVideoState,
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdVideoAudioActions.mute]: {
			type: 'simple',
			name: 'Mute',
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.mute,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserVideoMic.mute,
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdVideoAudioActions.unmute]: {
			type: 'simple',
			name: 'Mute_All',
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.unmute,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserVideoMic.unmute,
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdVideoAudioActions.muteAll]: {
			type: 'simple',
			name: 'Mute_All',
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.muteAllExceptHost,
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
		},
		[PresetIdVideoAudioActions.unmuteAll]: {
			type: 'simple',
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
		},
		[PresetIdVideoAudioActions.muteAllExcept]: {
			type: 'simple',
			name: 'mute_all_except',
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.muteAllExceptSelected,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobal.muteAllExcept,
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdVideoAudioActions.muteAllExceptHosts]: {
			type: 'simple',
			name: 'Mute all except Hosts',
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.muteAllExceptHostGroup,
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
		},
		[PresetIdVideoAudioActions.muteAllExceptSpotlight]: {
			type: 'simple',
			name: 'Mute all except Spotlights',
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.muteAllExceptSpotlightGroup,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobal.muteAllExceptSpot,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdVideoAudioActions.toggleMute]: {
			type: 'simple',
			name: 'Toggle_mute',
			style: {
				text: '',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
				png64: presetImages.toggleMute,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserVideoMic.toggleMuteState,
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
		id: 'video_audio_actions',
		name: 'Video/Audio Actions',
		definitions: Object.values(PresetIdVideoAudioActions),
	}

	return { section, presets }
}
