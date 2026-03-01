import { ActionIdUserVideoMic } from '../actions/action-user-video-mic.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { CompanionPresetExt } from './preset-utils.js'
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

export function GetPresetsVideoAudioActions(): { [id in PresetIdVideoAudioActions]: CompanionPresetExt | undefined } {
	const presets: { [id in PresetIdVideoAudioActions]: CompanionPresetExt | undefined } = {
		/**
		 * Video/Audio Actions
		 */
		[PresetIdVideoAudioActions.videoOn]: {
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
		},
		[PresetIdVideoAudioActions.videoOff]: {
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
		},
		[PresetIdVideoAudioActions.toggleVideo]: {
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
		},
		[PresetIdVideoAudioActions.mute]: {
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
		},
		[PresetIdVideoAudioActions.unmute]: {
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
		},
		[PresetIdVideoAudioActions.muteAll]: {
			type: 'button',
			category: 'Video/Audio Actions',
			name: 'Mute_All',
			style: {
				text: 'Mute all Except The Host',
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
		},
		[PresetIdVideoAudioActions.unmuteAll]: {
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
		},
		[PresetIdVideoAudioActions.muteAllExcept]: {
			type: 'button',
			category: 'Video/Audio Actions',
			name: 'mute_all_except',
			style: {
				text: 'Mute All Except Selected',
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
		},
		[PresetIdVideoAudioActions.muteAllExceptHosts]: {
			type: 'button',
			category: 'Video/Audio Actions',
			name: 'Mute all except Hosts',
			style: {
				text: 'Mute All Except All Hosts',
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
		},
		[PresetIdVideoAudioActions.muteAllExceptSpotlight]: {
			type: 'button',
			category: 'Video/Audio Actions',
			name: 'Mute all except Spotlights',
			style: {
				text: 'Mute All Except Spotlight',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
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
		},
	}
	return presets
}
