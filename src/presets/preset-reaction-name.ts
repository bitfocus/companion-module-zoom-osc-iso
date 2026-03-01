import { ActionIdUserHandRaised } from '../actions/action-user-hand-raised.js'
import { InstanceBaseExt, ZoomUserDataInterface, colorBlack, colorLightGray, colorTeal, userExist } from '../utils.js'
import { CompanionPresetExt } from './preset-utils.js'
import { ActionIdUserRolesAndAction } from '../actions/action-user-roles-action.js'
import { ActionIdGlobal } from '../actions/action-global.js'
import { ZoomConfig } from '../config.js'

export enum PresetIdReactionName {
	raiseHand = 'Raise_Hand',
	lowerHand = 'Lower_Hand',
	toggleHand = 'Toggle_Hand',
	lowerAllHands = 'Lower_All_Hands',
}

export function GetPresetsReactionName(instance: InstanceBaseExt<ZoomConfig>): {
	[id in PresetIdReactionName]: CompanionPresetExt | undefined
} {
	const presets = {
		[PresetIdReactionName.raiseHand]: {
			type: 'button',
			category: 'Reaction & Name Actions',
			name: `Raise_Hand`,
			style: {
				text: `Raise Hand`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserHandRaised.raiseHand,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdReactionName.lowerHand]: {
			type: 'button',
			category: 'Reaction & Name Actions',
			name: `Lower_Hand`,
			style: {
				text: `Lower Hand`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserHandRaised.lowerHand,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdReactionName.toggleHand]: {
			type: 'button',
			category: 'Reaction & Name Actions',
			name: `Toggle_Hand`,
			style: {
				text: `Toggle Hand`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdUserHandRaised.toggleHand,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdReactionName.lowerAllHands]: {
			type: 'button',
			category: 'Reaction & Name Actions',
			name: `Lower_All_Hands`,
			style: {
				text: `Lower All Hands`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdGlobal.lowerAllHands,
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
	} as { [id in PresetIdReactionName]: CompanionPresetExt | undefined }
	const zoomUserData: ZoomUserDataInterface = instance.zoomUserData

	// User selection
	for (const key in zoomUserData) {
		if (userExist(Number(key), zoomUserData)) {
			const user = zoomUserData[key]
			presets[`Rename_Participant_${user.zoomId}` as PresetIdReactionName] = {
				type: 'button',
				category: 'Reaction & Name Actions',
				name: user.userName,
				style: {
					text: `Rename\\n$(zoomosc:${user.zoomId})`,
					size: '7',
					color: colorBlack,
					bgcolor: colorTeal,
				},
				steps: [
					{
						down: [
							{
								actionId: ActionIdUserRolesAndAction.rename,
								options: {
									user: user.zoomId,
									name: user.userName,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
		}
	}

	return presets
}
