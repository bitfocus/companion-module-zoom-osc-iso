import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type { ModuleSchema } from '../index.js'
import { FeedbackId } from '../feedback.js'
import { buildParticipantTemplateSection, positionVariableExpression } from './preset-utils.js'
import { ActionIdGallery } from '../actions/action-gallery.js'

export const galleryTemplatePresetId = 'Gallery_position'
const galleryPositions = 49

/**
 * Select from Gallery: one layered template preset, expanded by Companion into a button per gallery position.
 */
export function GetPresetsListGallery(): {
	section: CompanionPresetSection<ModuleSchema>
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	return buildParticipantTemplateSection({
		sectionId: 'gallery',
		sectionName: 'Select from Gallery',
		presetId: galleryTemplatePresetId,
		presetName: 'Gallery position',
		positions: galleryPositions,
		positionName: (position) => `Gallery position ${position}`,
		nameExpression: positionVariableExpression('GalleryPosition', 2),
		target: (position) => ({ feedbackId: FeedbackId.galleryBased, options: { position } }),
		action: (position) => ({
			actionId: ActionIdGallery.selectFromGalleryPosition,
			options: { position, option: 'toggle' },
		}),
	})
}
