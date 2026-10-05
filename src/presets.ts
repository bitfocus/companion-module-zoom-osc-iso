import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type ModuleInstance from './index.js'
import type { ModuleSchema } from './index.js'
import { GetPresetsListParticipants } from './presets/preset-participants.js'
import { GetPresetsListGallery } from './presets/preset-gallery.js'
import { GetPresetsManageSelections } from './presets/preset-manage-selections.js'
import { GetPresetsGroups } from './presets/preset-groups.js'
import { GetPresetsPinSpotlightViewActions } from './presets/preset-pin-spotlight-view.js'
import { GetPresetsVideoAudioActions } from './presets/preset-video-audio-actions.js'
import { GetPresetsZoomISOSelections } from './presets/preset-zoomiso-selections.js'
import { GetPresetsZoomISOActions } from './presets/preset-zoomiso-actions.js'
import { GetPresetsReactionName } from './presets/preset-reaction-name.js'
import { GetPresetsRoleManagement } from './presets/preset-role-management.js'
import { GetPresetsJoinLeaveEnd } from './presets/preset-join-leave-end.js'
import { GetPresetsDeviceSettings } from './presets/preset-devices-settings.js'
import { GetPresetsChat } from './presets/preset-chat.js'
import { GetPresetsSharing } from './presets/preset-sharing.js'
import { GetPresetsBreakout } from './presets/preset-breakout.js'
import { GetPresetsRecording } from './presets/preset-recording.js'
import { GetPresetsDataCustom } from './presets/preset-data-custom.js'

/**
 * Registers every preset with Companion. Each category file returns its section(s) and presets; sections list
 * their presets directly (no nested groups) so every category can be collapsed in the Companion UI.
 * The order below is the order the sections appear in the Companion UI (the v1 category order).
 * Call this after the action and feedback definitions are set.
 */
export function UpdatePresets(instance: ModuleInstance): void {
	const categories = [
		GetPresetsListParticipants(),
		GetPresetsListGallery(),
		GetPresetsManageSelections(),
		GetPresetsGroups(instance),
		GetPresetsPinSpotlightViewActions(),
		GetPresetsVideoAudioActions(),
		GetPresetsZoomISOSelections(instance),
		GetPresetsZoomISOActions(instance),
		GetPresetsReactionName(),
		GetPresetsRoleManagement(),
		GetPresetsJoinLeaveEnd(),
		GetPresetsDeviceSettings(),
		GetPresetsChat(),
		GetPresetsSharing(),
		GetPresetsBreakout(),
		GetPresetsRecording(),
		GetPresetsDataCustom(),
	]

	// a section whose groups would all be empty (e.g. no groups configured yet) is left out
	const structure: CompanionPresetSection<ModuleSchema>[] = categories
		.flatMap((c) => ('sections' in c ? c.sections : [c.section]))
		.filter((section) => section.definitions.length > 0)
	const presets: CompanionPresetDefinitions<ModuleSchema> = Object.assign({}, ...categories.map((c) => c.presets))

	instance.setPresetDefinitions(structure, presets)
}
