import { FeedbackId, feedbackType } from '../feedback'
import { CompanionPresetDefinitionsExt, getFeedbackStyleSelected, getParticipantStyleDefault } from './preset-utils'
import { ActionIdGallery } from '../actions/action-gallery'
import { padding } from '../utils'

export function GetPresetsListGallery(): CompanionPresetDefinitionsExt {
	const presets: CompanionPresetDefinitionsExt = {}

	for (let index = 1; index < 50; index++) {
		presets[`Gallery_position_${index})`] = {
			type: 'button',
			category: 'Select from Gallery',
			name: `$(zoomosc:Gallery position ${index})`,
			style: getParticipantStyleDefault(`$(zoomosc:GalleryPosition${padding(index, 2)})`, index),
			steps: [
				{
					down: [
						{
							actionId: ActionIdGallery.selectFromGalleryPosition,
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
					feedbackId: FeedbackId.galleryBased,
					options: {
						position: index,
						type: feedbackType.selected,
					},
					style: getFeedbackStyleSelected(),
				},
				{
					feedbackId: FeedbackId.galleryBasedAdvanced,
					options: {
						position: index,
					},
				},
			],
		}
	}

	return presets
}
