import { ActionId } from '../actions'
import { FeedbackId, feedbackType } from '../feedback'
import { InstanceBaseExt, padding } from '../utils'
import { ZoomConfig } from '../config'
import {
	CompanionPresetDefinitionsExt,
	PresetFeedbackDefinition,
	feedbackStyleSelected,
	getParticipantStyleActiveSpeaker,
	getParticipantStyleDefault,
} from './preset-utils'

export function GetPresetsListParticipants(instance: InstanceBaseExt<ZoomConfig>): CompanionPresetDefinitionsExt {
	const presets: CompanionPresetDefinitionsExt = {}

	/**
	 * Select from Participants
	 */
	for (let index = 1; index < 1000; index++) {
		const indexFeedbacks: PresetFeedbackDefinition = [
			{
				feedbackId: FeedbackId.indexBased,
				options: {
					position: index,
					type: feedbackType.selected,
				},
				style: feedbackStyleSelected,
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

		presets[`Caller_${index}`] = {
			type: 'button',
			category: 'Select from Participants',
			name: `Caller${index}`,
			style: getParticipantStyleDefault(instance, `$(zoomosc:Participant${padding(index, 3)})`, index),
			steps: [
				{
					down: [
						{
							actionId: ActionId.selectFromIndexPosition,
							options: {
								position: index,
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

	return presets
}
