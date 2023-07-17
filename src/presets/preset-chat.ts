import { ActionId } from '../actions'
import { colorBlack, colorLightGray } from '../utils'
import { CompanionPresetDefinitionsExt } from './preset-utils'

export function GetPresetsChat(): CompanionPresetDefinitionsExt {
	const presets: CompanionPresetDefinitionsExt = {}
	/**
	 * Chat Actions
	 */
	presets[`Send_Chat_Everyone`] = {
		type: 'button',
		category: 'Chat Actions',
		name: `Send_Chat_Everyone`,
		style: {
			text: `Send Chat Everyone`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.sendAChatToEveryone,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`Send_Chat_DM`] = {
		type: 'button',
		category: 'Chat Actions',
		name: `Send_Chat_DM`,
		style: {
			text: `Send Chat DM`,
			size: '14',
			color: colorBlack,
			bgcolor: colorLightGray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.sendAChatViaDM,
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
