import { ActionIdUserSpotlight } from '../actions/action-user-spotlight.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { CompanionPresetDefinitionsExt } from './preset-utils.js'
import { ActionIdUserPin } from '../actions/action-user-pin.js'
import { ActionIdUserView } from '../actions/action-user-view.js'
import { ActionIdUserSettings } from '../actions/action-user-settings.js'
import { ActionIdGlobal } from '../actions/action-global.js'

export function GetPresetsPinSpotlightViewActions(): CompanionPresetDefinitionsExt {
	const presets: CompanionPresetDefinitionsExt = {}

	/**
	 * Pin/Spotlight & View Actions
	 */
	presets['Pin'] = {
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
	}

	presets['add_Pin'] = {
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
	}

	presets['un_Pin'] = {
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
	}

	presets['Toggle_Pin'] = {
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
	}

	presets['Pin_Screen_2'] = {
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
						actionId: ActionIdUserPin.pinScreen2,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['UnPin_Screen_2'] = {
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
						actionId: ActionIdUserPin.unPinScreen2,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['Toggle_Screen_2'] = {
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
						actionId: ActionIdUserPin.togglePinScreen2,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['Clear_Pins'] = {
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
	}

	presets['Spotlight'] = {
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
	}

	presets['Add_Spotlight'] = {
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
	}

	presets['Un_Spotlight'] = {
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
	}

	presets['Toggle_Spotlight'] = {
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
	}

	presets['Clear_Spotlight'] = {
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
	}

	presets['Set_Gallery_View'] = {
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
	}

	presets['Set_Speaker_View'] = {
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
	}

	presets['Next_Gallery_Page'] = {
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
	}

	presets['Previous_Gallery_Page'] = {
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
	}

	presets['Show_Non_Video_Participants'] = {
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
	}

	presets['Hide_Non_Video_Participants'] = {
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
	}
	return presets
}
