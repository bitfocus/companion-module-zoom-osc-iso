import { ActionId } from '../actions'
import { colorBlack, colorLightGray } from '../utils'
import { CompanionPresetDefinitionsExt } from './preset-utils'

export function GetPresetsDataCustom(): CompanionPresetDefinitionsExt {
	const presets: CompanionPresetDefinitionsExt = {}

	/**
	 * Data and Custom Actions
	 */
	presets[`Ping`] = {
		type: 'button',
		category: 'Data and Custom Actions',
		name: `Ping`,
		style: {
			text: `Ping`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.pingZoomOSC,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Request_List_Participants`] = {
		type: 'button',
		category: 'Data and Custom Actions',
		name: `Request_List_Participants`,
		style: {
			text: `Request List of Participants`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.listUsers,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Request_List_of_Breakout_Rooms`] = {
		type: 'button',
		category: 'Data and Custom Actions',
		name: `Request_List_of_Breakout_Rooms`,
		style: {
			text: `Request List of Breakout Rooms`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.requestListOfBreakoutRooms,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Request_Gallery_Order`] = {
		type: 'button',
		category: 'Data and Custom Actions',
		name: `Request_Gallery_Order`,
		style: {
			text: `Request Gallery Order`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.requestOrderOfGalleryView,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Request_Gallery_Count`] = {
		type: 'button',
		category: 'Data and Custom Actions',
		name: `Request_Gallery_Count`,
		style: {
			text: `Request Gallery Count`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.requestGalleryCount,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Custom_Command`] = {
		type: 'button',
		category: 'Data and Custom Actions',
		name: `Custom_Command`,
		style: {
			text: `Custom Command`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.customCommand,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Custom_Command_with_Arguments`] = {
		type: 'button',
		category: 'Data and Custom Actions',
		name: `Custom_Command_with_Arguments`,
		style: {
			text: `Custom Command with Arguments`,
			size: '7',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.customCommandWithArguments,
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
