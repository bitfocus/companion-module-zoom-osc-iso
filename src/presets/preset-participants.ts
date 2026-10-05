import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type { ModuleSchema } from '../index.js'
import { FeedbackId } from '../feedback.js'
import { buildParticipantTemplateSection, positionVariableExpression } from './preset-utils.js'
import { ActionIdUsers } from '../actions/action-user.js'

export const participantTemplatePresetId = 'Caller'
/** Positions listed in the section; further participants are reached by changing a button's position local variable */
const participantPositions = 49

/**
 * Select from Participants: one layered template preset, expanded by Companion into a button per participant position.
 * Needs "Enable Variable For Participants", as the names and feedbacks use the participant position variables.
 */
export function GetPresetsListParticipants(): {
	section: CompanionPresetSection<ModuleSchema>
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	return buildParticipantTemplateSection({
		sectionId: 'participants',
		sectionName: 'Select from Participants',
		presetId: participantTemplatePresetId,
		presetName: 'Caller',
		positions: participantPositions,
		positionName: (position) => `Caller${position}`,
		nameExpression: positionVariableExpression('Participant', 3),
		target: (position) => ({ feedbackId: FeedbackId.indexBased, options: { position } }),
		action: (position) => ({
			actionId: ActionIdUsers.selectFromIndexPosition,
			options: { position, option: 'toggle' },
		}),
	})
}
