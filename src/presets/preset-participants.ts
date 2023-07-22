import { FeedbackId, feedbackType } from '../feedback'
import { padding } from '../utils'
import { CompanionPresetDefinitionsExt, getFeedbackStyleSelected, getParticipantStyleDefault } from './preset-utils'
import { ActionIdUsers } from '../actions/action-user'

export function GetPresetsListParticipants(): CompanionPresetDefinitionsExt {
	const presets: CompanionPresetDefinitionsExt = {}

	/**
	 * Select from Participants
	 */
	for (let index = 1; index < 1000; index++) {
		presets[`Caller_${index}`] = {
			type: 'button',
			category: 'Select from Participants',
			name: `Caller${index}`,
			style: getParticipantStyleDefault(`$(zoomosc:Participant${padding(index, 3)})`, index),
			steps: [
				{
					down: [
						{
							actionId: ActionIdUsers.selectFromIndexPosition,
							options: {
								position: index,
								option: 'toggle',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: FeedbackId.indexBased,
					options: {
						position: index,
						type: feedbackType.selected,
					},
					style: getFeedbackStyleSelected(),
				},
				{
					feedbackId: FeedbackId.indexBasedAdvanced,
					options: {
						position: index,
					},
				},
			],
		}
	}

	return presets
}
