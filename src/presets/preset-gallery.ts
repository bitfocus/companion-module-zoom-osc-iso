import type {
	CompanionPresetDefinitions,
	CompanionPresetSection,
	SomePresetSimpleFeedbackEntry,
} from '@companion-module/base'
import type ModuleInstance from '../index.js'
import type { ModuleSchema } from '../index.js'
import { FeedbackId, feedbackType } from '../feedback.js'
import {
	getFeedbackStyleSelected,
	getFeedbackStyleSpotlight,
	getParticipantStyleActiveSpeaker,
	getParticipantStyleDefault,
} from './preset-utils.js'
import { ActionIdGallery } from '../actions/action-gallery.js'
import { padding } from '../utils.js'

export type PresetIdListGallery = `Gallery_position_${number}`

/**
 * Select from Gallery: one preset per gallery position.
 * The style text builds a variable name from the position, so this stays a loop of simple presets
 * rather than a template group.
 */
export function GetPresetsListGallery(instance: ModuleInstance): {
	section: CompanionPresetSection<ModuleSchema>
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	const presets: { [id: PresetIdListGallery]: CompanionPresetDefinitions<ModuleSchema>[string] } = {}
	const ids: PresetIdListGallery[] = []

	for (let index = 1; index < 50; index++) {
		const galleryFeedbacks: SomePresetSimpleFeedbackEntry<ModuleSchema>[] = [
			{
				feedbackId: FeedbackId.galleryBased,
				options: {
					position: index,
					type: feedbackType.spotlightOn,
				},
				style: getFeedbackStyleSpotlight(),
			},
			{
				feedbackId: FeedbackId.galleryBased,
				options: {
					position: index,
					type: feedbackType.selected,
				},
				style: getFeedbackStyleSelected(),
			},
		]

		if (instance.config.feedbackImagesWithIcons !== 4) {
			galleryFeedbacks.push({
				feedbackId: FeedbackId.galleryBased,
				options: {
					position: index,
					type: feedbackType.activeSpeaker,
				},
				style: getParticipantStyleActiveSpeaker(`$(zoomosc:GalleryPosition${padding(index, 2)})`, index),
			})
		}

		galleryFeedbacks.push({
			feedbackId: FeedbackId.galleryBasedAdvanced,
			options: {
				position: index,
			},
		})

		const id: PresetIdListGallery = `Gallery_position_${index}`
		ids.push(id)
		presets[id] = {
			type: 'simple',
			name: `$(zoomosc:Gallery position ${index})`,
			style: getParticipantStyleDefault(instance, `$(zoomosc:GalleryPosition${padding(index, 2)})`, index),
			steps: [
				{
					down: [
						{
							actionId: ActionIdGallery.selectFromGalleryPosition,
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
			feedbacks: galleryFeedbacks,
		}
	}

	const section: CompanionPresetSection<ModuleSchema> = {
		id: 'gallery',
		name: 'Select from Gallery',
		definitions: [{ id: 'gallery_positions', type: 'simple', name: 'Select from Gallery', presets: ids }],
	}

	return { section, presets }
}
