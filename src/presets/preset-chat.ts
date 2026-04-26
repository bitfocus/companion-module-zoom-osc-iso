import { ActionIdUserChat } from '../actions/action-user-chat.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { CompanionPresetExt } from './preset-utils.js'
import { ActionIdGlobal } from '../actions/action-global.js'

export enum PresetIdChat {
	sendChatEveryone = 'Send_Chat_Everyone',
	sendChatDM = 'Send_Chat_DM',
}

export function GetPresetsChat(): { [id in PresetIdChat]: CompanionPresetExt | undefined } {
	const presets: { [id in PresetIdChat]: CompanionPresetExt | undefined } = {
		/**
		 * Chat Actions
		 */
		[PresetIdChat.sendChatEveryone]: {
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
		},
		[PresetIdChat.sendChatDM]: {
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
		},
	}
	return presets
}
