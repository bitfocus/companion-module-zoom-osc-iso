import type {
	CompanionPresetDefinitions,
	CompanionPresetSection,
	SomePresetSimpleFeedbackEntry,
} from '@companion-module/base'
import type ModuleInstance from '../index.js'
import type { ModuleSchema } from '../index.js'
import { FeedbackId, feedbackType } from '../feedback.js'
import { padding } from '../utils.js'
import {
	getFeedbackStyleSelected,
	getFeedbackStyleSpotlight,
	getParticipantStyleActiveSpeaker,
	getParticipantStyleDefault,
} from './preset-utils.js'
import { ActionIdUsers } from '../actions/action-user.js'

export type PresetIdListParticipants = `Caller_${number}`

/**
 * Select from Participants: one preset per participant position.
 * The style text builds a variable name from the position, so this stays a loop of simple presets
 * rather than a template group.
 */
export function GetPresetsListParticipants(instance: ModuleInstance): {
	section: CompanionPresetSection<ModuleSchema>
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	const presets: { [id: PresetIdListParticipants]: CompanionPresetDefinitions<ModuleSchema>[string] } = {}
	const ids: PresetIdListParticipants[] = []

	for (let index = 1; index <= 1000; index++) {
		const indexFeedbacks: SomePresetSimpleFeedbackEntry<ModuleSchema>[] = [
			{
				feedbackId: FeedbackId.indexBased,
				options: {
					position: index,
					type: feedbackType.spotlightOn,
				},
				style: getFeedbackStyleSpotlight(),
			},
			{
				feedbackId: FeedbackId.indexBased,
				options: {
					position: index,
					type: feedbackType.selected,
				},
				style: getFeedbackStyleSelected(),
			},
		]

		if (instance.config.feedbackImagesWithIcons !== 4) {
			indexFeedbacks.push({
				feedbackId: FeedbackId.indexBased,
				options: {
					position: index,
					type: feedbackType.activeSpeaker,
				},
				style: getParticipantStyleActiveSpeaker(`$(zoomosc:Participant${padding(index, 3)})`, index),
			})
		}

		indexFeedbacks.push({
			feedbackId: FeedbackId.indexBasedAdvanced,
			options: {
				position: index,
			},
		})

		const id: PresetIdListParticipants = `Caller_${index}`
		ids.push(id)
		presets[id] = {
			type: 'simple',
			name: `Caller${index}`,
			style: getParticipantStyleDefault(instance, `$(zoomosc:Participant${padding(index, 3)})`, index),
			steps: [
				{
					down: [
						{
							actionId: ActionIdUsers.selectFromIndexPosition,
							options: {
								// the position dropdown uses string ids
								position: String(index),
								option: 'toggle',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: indexFeedbacks,
		}
	}

	const section: CompanionPresetSection<ModuleSchema> = {
		id: 'participants',
		name: 'Select from Participants',
		definitions: [{ id: 'participants_positions', type: 'simple', name: 'Select from Participants', presets: ids }],
	}

	return { section, presets }
}
