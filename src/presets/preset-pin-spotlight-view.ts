import { ActionId } from '../actions'
import { colorBlack, colorLightGray } from '../utils'
import { CompanionPresetDefinitionsExt } from './preset-utils'

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
						actionId: ActionId.pin,
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
						actionId: ActionId.addPin,
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
						actionId: ActionId.unpin,
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
						actionId: ActionId.togglePin,
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
						actionId: ActionId.pinScreen2,
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
						actionId: ActionId.unPinScreen2,
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
						actionId: ActionId.togglePinScreen2,
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
						actionId: ActionId.clearPins,
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
						actionId: ActionId.spotLight,
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
						actionId: ActionId.addSpotlight,
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
						actionId: ActionId.unSpotLight,
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
						actionId: ActionId.toggleSpotlight,
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
						actionId: ActionId.clearSpotlight,
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
						actionId: ActionId.setGalleryView,
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
						actionId: ActionId.setSpeakerView,
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
						actionId: ActionId.gotoNextGalleryPage,
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
						actionId: ActionId.gotoPreviousGalleryPage,
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
						actionId: ActionId.showNonVideoParticipants,
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
						actionId: ActionId.hideNonVideoParticipants,
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
