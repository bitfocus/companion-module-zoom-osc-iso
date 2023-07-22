import { ActionIdUserChat } from '../actions/action-user-chat'
import { colorBlack, colorLightGray } from '../utils'
import { CompanionPresetDefinitionsExt } from './preset-utils'
import { ActionIdGlobal } from '../actions/action-global'

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
						actionId: ActionIdGlobal.sendAChatToEveryone,
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
						actionId: ActionIdUserChat.sendAChatViaDM,
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
