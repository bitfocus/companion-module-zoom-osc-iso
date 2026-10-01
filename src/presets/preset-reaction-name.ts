import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type { ModuleSchema } from '../index.js'
import { ActionIdUserHandRaised } from '../actions/action-user-hand-raised.js'
import { colorBlack, colorLightGray } from '../utils.js'
import { ActionIdGlobal } from '../actions/action-global.js'

export enum PresetIdReactionName {
	raiseHand = 'Raise_Hand',
	lowerHand = 'Lower_Hand',
	toggleHand = 'Toggle_Hand',
	lowerAllHands = 'Lower_All_Hands',
}

// v1 also had a loop here that was meant to add one `Rename_Participant_<zoomId>` preset per participant,
// but it read `instance.zoomUserData` (lower-case z), which never existed, so it never produced a preset.
// It is left out of the v2 port so behaviour stays the same; see the migration report.
export function GetPresetsReactionName(): {
	section: CompanionPresetSection<ModuleSchema>
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	const presets: { [id in PresetIdReactionName]: CompanionPresetDefinitions<ModuleSchema>[string] } = {
		[PresetIdReactionName.raiseHand]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdReactionName.lowerHand]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdReactionName.toggleHand]: {
			type: 'simple',
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
							options: { userName: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdReactionName.lowerAllHands]: {
			type: 'simple',
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
	}
	const section: CompanionPresetSection<ModuleSchema> = {
		id: 'reaction_name',
		name: 'Reaction & Name Actions',
		definitions: [
			{
				id: 'reaction_name_buttons',
				type: 'simple',
				name: 'Reaction & Name Actions',
				presets: Object.values(PresetIdReactionName),
			},
		],
	}

	return { section, presets }
}
