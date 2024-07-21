import { CompanionPresetDefinitions } from '@companion-module/base'

import { InstanceBaseExt } from './utils.js'
import { CompanionPresetDefinitionsExt } from './presets/preset-utils.js'
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
import { ZoomConfig } from './config.js'

export function GetPresetList(instance: InstanceBaseExt<ZoomConfig>): CompanionPresetDefinitions {
	const presetsParticipants = GetPresetsListParticipants(instance)
	const presetsGallery = GetPresetsListGallery(instance)
	const presetsManageSelections = GetPresetsManageSelections()
	const presetsGroups = GetPresetsGroups(instance)
	const presetsPinSpotlightViewActions = GetPresetsPinSpotlightViewActions()
	const presetsVideoAudioActions = GetPresetsVideoAudioActions()
	const presetsZoomISOSelections = GetPresetsZoomISOSelections(instance)
	const presetsZoomISOActions = GetPresetsZoomISOActions(instance)
	const presetsReactionNames = GetPresetsReactionName(instance)
	const presetsRoleManagement = GetPresetsRoleManagement()
	const presetsJoinLeaveEnd = GetPresetsJoinLeaveEnd()
	const presetsDeviceSettings = GetPresetsDeviceSettings()
	const presetChat = GetPresetsChat()
	const presetSharing = GetPresetsSharing()
	const presetBreakout = GetPresetsBreakout()
	const presetRecording = GetPresetsRecording()
	const presetDataCustom = GetPresetsDataCustom()

	const presets: CompanionPresetDefinitionsExt = {
		...presetsParticipants,
		...presetsGallery,
		...presetsManageSelections,
		...presetsGroups,
		...presetsPinSpotlightViewActions,
		...presetsVideoAudioActions,
		...presetsZoomISOSelections,
		...presetsZoomISOActions,
		...presetsReactionNames,
		...presetsRoleManagement,
		...presetsJoinLeaveEnd,
		...presetsDeviceSettings,
		...presetChat,
		...presetSharing,
		...presetBreakout,
		...presetRecording,
		...presetDataCustom,
	}

	return presets
}
