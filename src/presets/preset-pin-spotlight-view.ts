import { ActionIdUserSpotlight } from '../actions/action-user-spotlight.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { CompanionPresetExt } from './preset-utils.js'
import { ActionIdUserPin } from '../actions/action-user-pin.js'
import { ActionIdUserView } from '../actions/action-user-view.js'
import { ActionIdUserSettings } from '../actions/action-user-settings.js'
import { ActionIdGlobal } from '../actions/action-global.js'

export enum PresetIdPinSpotlightViewActions {
	pin = 'Pin',
	addPin = 'add_Pin',
	unPin = 'un_Pin',
	togglePin = 'Toggle_Pin',
	pinScreen2 = 'Pin_Screen_2',
	unPinScreen2 = 'UnPin_Screen_2',
	toggleScreen2 = 'Toggle_Screen_2',
	clearPins = 'Clear_Pins',
	spotlight = 'Spotlight',
	addSpotlight = 'Add_Spotlight',
	unSpotlight = 'Un_Spotlight',
	toggleSpotlight = 'Toggle_Spotlight',
	clearSpotlight = 'Clear_Spotlight',
	setGalleryView = 'Set_Gallery_View',
	setSpeakerView = 'Set_Speaker_View',
	nextGalleryPage = 'Next_Gallery_Page',
	previousGalleryPage = 'Previous_Gallery_Page',
	showNonVideoParticipants = 'Show_Non_Video_Participants',
	hideNonVideoParticipants = 'Hide_Non_Video_Participants',
}

export function GetPresetsPinSpotlightViewActions(): {
	[id in PresetIdPinSpotlightViewActions]: CompanionPresetExt | undefined
} {
	const presets: { [id in PresetIdPinSpotlightViewActions]: CompanionPresetExt | undefined } = {
		/**
		 * Pin/Spotlight & View Actions
		 */
		[PresetIdPinSpotlightViewActions.pin]: {
			type: 'button',
			category: 'Pin/Spotlight & View Actions',
			name: 'Pin',
			style: {
				text: 'Pin',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserPin.pin,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.addPin]: {
			type: 'button',
			category: 'Pin/Spotlight & View Actions',
			name: 'add_Pin',
			style: {
				text: 'Add Pin',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserPin.addPin,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.unPin]: {
			type: 'button',
			category: 'Pin/Spotlight & View Actions',
			name: 'un_Pin',
			style: {
				text: 'Un Pin',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserPin.unpin,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.togglePin]: {
			type: 'button',
			category: 'Pin/Spotlight & View Actions',
			name: 'Toggle_Pin',
			style: {
				text: 'Toggle Pin',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserPin.togglePin,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.pinScreen2]: {
			type: 'button',
			category: 'Pin/Spotlight & View Actions',
			name: 'Pin_Screen_2',
			style: {
				text: 'Pin Screen 2',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserPin.pin2,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.unPinScreen2]: {
			type: 'button',
			category: 'Pin/Spotlight & View Actions',
			name: 'UnPin_Screen_2',
			style: {
				text: 'Un Pin Screen 2',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserPin.unPin2,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.toggleScreen2]: {
			type: 'button',
			category: 'Pin/Spotlight & View Actions',
			name: 'Toggle_Screen_2',
			style: {
				text: 'Toggle Pin Screen 2',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserPin.togglePin2,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.clearPins]: {
			type: 'button',
			category: 'Pin/Spotlight & View Actions',
			name: 'Clear_Pins',
			style: {
				text: 'Clear Pins',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserPin.clearPins,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.spotlight]: {
			type: 'button',
			category: 'Pin/Spotlight & View Actions',
			name: 'Spotlight',
			style: {
				text: 'Single Spotlight',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSpotlight.spotLight,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.addSpotlight]: {
			type: 'button',
			category: 'Pin/Spotlight & View Actions',
			name: 'Add_Spotlight',
			style: {
				text: 'Add to Spotlight',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSpotlight.addSpotlight,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.unSpotlight]: {
			type: 'button',
			category: 'Pin/Spotlight & View Actions',
			name: 'Un_Spotlight',
			style: {
				text: 'Un Spotlight',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSpotlight.unSpotLight,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.toggleSpotlight]: {
			type: 'button',
			category: 'Pin/Spotlight & View Actions',
			name: 'Toggle_Spotlight',
			style: {
				text: 'Toggle Spotlight',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSpotlight.toggleSpotlight,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.clearSpotlight]: {
			type: 'button',
			category: 'Pin/Spotlight & View Actions',
			name: 'Clear_Spotlight',
			style: {
				text: 'Clear Spotlight',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobal.clearSpotlight,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.setGalleryView]: {
			type: 'button',
			category: 'Pin/Spotlight & View Actions',
			name: 'Set_Gallery_View',
			style: {
				text: 'Set Gallery View',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserView.setGalleryView,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.setSpeakerView]: {
			type: 'button',
			category: 'Pin/Spotlight & View Actions',
			name: 'Set_Speaker_View',
			style: {
				text: 'Set Speaker View',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserView.setSpeakerView,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.nextGalleryPage]: {
			type: 'button',
			category: 'Pin/Spotlight & View Actions',
			name: 'Next_Gallery_Page',
			style: {
				text: 'Next Gallery Page',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserView.gotoNextGalleryPage,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.previousGalleryPage]: {
			type: 'button',
			category: 'Pin/Spotlight & View Actions',
			name: 'Previous_Gallery_Page',
			style: {
				text: 'Previous Gallery Page',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserView.gotoPreviousGalleryPage,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.showNonVideoParticipants]: {
			type: 'button',
			category: 'Pin/Spotlight & View Actions',
			name: 'Show_Non_Video_Participants',
			style: {
				text: 'Show Non Video Participants',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSettings.showNonVideoParticipants,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.hideNonVideoParticipants]: {
			type: 'button',
			category: 'Pin/Spotlight & View Actions',
			name: 'Hide_Non_Video_Participants',
			style: {
				text: 'Hide Non Video Participants',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserSettings.hideNonVideoParticipants,
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
