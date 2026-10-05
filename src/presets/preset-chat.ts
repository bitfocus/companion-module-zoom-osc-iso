import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type { ModuleSchema } from '../index.js'
import { ActionIdUserChat } from '../actions/action-user-chat.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { ActionIdGlobal } from '../actions/action-global.js'

export enum PresetIdChat {
	sendChatEveryone = 'Send_Chat_Everyone',
	sendChatDM = 'Send_Chat_DM',
}

export function GetPresetsChat(): {
	section: CompanionPresetSection<ModuleSchema>
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	const presets: { [id in PresetIdChat]: CompanionPresetDefinitions<ModuleSchema>[string] } = {
		/**
		 * Chat Actions
		 */
		[PresetIdChat.sendChatEveryone]: {
			type: 'simple',
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
							options: { message: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdChat.sendChatDM]: {
			type: 'simple',
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
							options: { userName: '', message: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
	}
	const section: CompanionPresetSection<ModuleSchema> = {
		id: 'chat',
		name: 'Chat Actions',
		definitions: Object.values(PresetIdChat),
	}

	return { section, presets }
}
