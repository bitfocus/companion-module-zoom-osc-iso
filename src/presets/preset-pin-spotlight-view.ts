import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type { ModuleSchema } from '../index.js'
import { ActionIdUserSpotlight } from '../actions/action-user-spotlight.js'
import { colorBlack, colorLightGray } from '../utils.js'
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
	section: CompanionPresetSection<ModuleSchema>
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	const presets: { [id in PresetIdPinSpotlightViewActions]: CompanionPresetDefinitions<ModuleSchema>[string] } = {
		/**
		 * Pin/Spotlight & View Actions
		 */
		[PresetIdPinSpotlightViewActions.pin]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.addPin]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.unPin]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.togglePin]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.pinScreen2]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.unPinScreen2]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.toggleScreen2]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.clearPins]: {
			type: 'simple',
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
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.addSpotlight]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.unSpotlight]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.toggleSpotlight]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdPinSpotlightViewActions.clearSpotlight]: {
			type: 'simple',
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
			type: 'simple',
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
			type: 'simple',
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
			type: 'simple',
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
			type: 'simple',
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
			type: 'simple',
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
			type: 'simple',
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
	const section: CompanionPresetSection<ModuleSchema> = {
		id: 'pin_spotlight_view',
		name: 'Pin/Spotlight & View Actions',
		definitions: [
			{
				id: 'pin_spotlight_view_buttons',
				type: 'simple',
				name: 'Pin/Spotlight & View Actions',
				presets: Object.values(PresetIdPinSpotlightViewActions),
			},
		],
	}

	return { section, presets }
}
