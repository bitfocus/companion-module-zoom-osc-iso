import { ActionIdUserHandRaised } from '../actions/action-user-hand-raised'
import { ZoomUserDataInterface, colorBlack, colorLightGray, colorTeal, userExist } from '../utils'
import { CompanionPresetDefinitionsExt } from './preset-utils'
import { ActionIdUserRolesAndAction } from '../actions/action-user-roles-action'
import { ActionIdGlobal } from '../actions/action-global'

export function GetPresetsReactionName(ZoomUserData: ZoomUserDataInterface): CompanionPresetDefinitionsExt {
	const presets: CompanionPresetDefinitionsExt = {}

	/**
	 * Reaction & Name Actions
	 */
	presets[`Raise_Hand`] = {
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
	}
	presets[`Lower_Hand`] = {
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
	}

	presets[`Toggle_Hand`] = {
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
	}

	presets[`Lower_All_Hands`] = {
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
	}

	// User selection
	for (const key in ZoomUserData) {
		if (userExist(Number(key), ZoomUserData)) {
			const user = ZoomUserData[key]
			presets[`Rename_Participant_${user.zoomId}`] = {
				type: 'button',
				category: 'Reaction & Name Actions',
				name: user.userName,
				style: {
					text: `Rename\\n$(zoomosc:${user.zoomId})`,
					size: '14',
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
