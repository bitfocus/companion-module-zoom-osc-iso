import { CompanionPresetDefinitions } from '@companion-module/base'

import { InstanceBaseExt } from './utils.js'
import { CompanionPresetExt } from './presets/preset-utils.js'
import { PresetIdListParticipants, GetPresetsListParticipants } from './presets/preset-participants.js'
import { PresetIdListGallery, GetPresetsListGallery } from './presets/preset-gallery.js'
import { PresetIdManageSelections, GetPresetsManageSelections } from './presets/preset-manage-selections.js'
import { PresetIdGroups, GetPresetsGroups } from './presets/preset-groups.js'
import {
	PresetIdPinSpotlightViewActions,
	GetPresetsPinSpotlightViewActions,
} from './presets/preset-pin-spotlight-view.js'
import { PresetIdVideoAudioActions, GetPresetsVideoAudioActions } from './presets/preset-video-audio-actions.js'
import { PresetIdZoomISOSelections, GetPresetsZoomISOSelections } from './presets/preset-zoomiso-selections.js'
import { PresetIdZoomISOActions, GetPresetsZoomISOActions } from './presets/preset-zoomiso-actions.js'
import { PresetIdReactionName, GetPresetsReactionName } from './presets/preset-reaction-name.js'
import { PresetIdRoleManagement, GetPresetsRoleManagement } from './presets/preset-role-management.js'
import { PresetIdJoinLeaveEnd, GetPresetsJoinLeaveEnd } from './presets/preset-join-leave-end.js'
import { PresetIdDeviceSettings, GetPresetsDeviceSettings } from './presets/preset-devices-settings.js'
import { PresetIdChat, GetPresetsChat } from './presets/preset-chat.js'
import { PresetIdSharing, GetPresetsSharing } from './presets/preset-sharing.js'
import { PresetIdBreakout, GetPresetsBreakout } from './presets/preset-breakout.js'
import { PresetIdRecording, GetPresetsRecording } from './presets/preset-recording.js'
import { PresetIdDataCustom, GetPresetsDataCustom } from './presets/preset-data-custom.js'
import { ZoomConfig } from './config.js'

export function GetPresetList(instance: InstanceBaseExt<ZoomConfig>): CompanionPresetDefinitions {
	const presetsParticipants: { [id: PresetIdListParticipants]: CompanionPresetExt | undefined } =
		GetPresetsListParticipants(instance)

	const presetsGallery: { [id: PresetIdListGallery]: CompanionPresetExt | undefined } = GetPresetsListGallery(instance)

	const presetsManageSelections: { [id in PresetIdManageSelections]: CompanionPresetExt | undefined } =
		GetPresetsManageSelections()

	const presetsGroups: { [id in PresetIdGroups]: CompanionPresetExt | undefined } = GetPresetsGroups(instance)

	const presetsPinSpotlightViewActions: { [id in PresetIdPinSpotlightViewActions]: CompanionPresetExt | undefined } =
		GetPresetsPinSpotlightViewActions()

	const presetsVideoAudioActions: { [id in PresetIdVideoAudioActions]: CompanionPresetExt | undefined } =
		GetPresetsVideoAudioActions()

	const presetsZoomISOSelections: { [id in PresetIdZoomISOSelections]: CompanionPresetExt | undefined } =
		GetPresetsZoomISOSelections(instance)

	const presetsZoomISOActions: { [id in PresetIdZoomISOActions]: CompanionPresetExt | undefined } =
		GetPresetsZoomISOActions(instance)

	const presetsReactionNames: { [id in PresetIdReactionName]: CompanionPresetExt | undefined } =
		GetPresetsReactionName(instance)

	const presetsRoleManagement: { [id in PresetIdRoleManagement]: CompanionPresetExt | undefined } =
		GetPresetsRoleManagement()

	const presetsJoinLeaveEnd: { [id in PresetIdJoinLeaveEnd]: CompanionPresetExt | undefined } = GetPresetsJoinLeaveEnd()

	const presetsDeviceSettings: { [id in PresetIdDeviceSettings]: CompanionPresetExt | undefined } =
		GetPresetsDeviceSettings()

	const presetChat: { [id in PresetIdChat]: CompanionPresetExt | undefined } = GetPresetsChat()

	const presetSharing: { [id in PresetIdSharing]: CompanionPresetExt | undefined } = GetPresetsSharing()

	const presetBreakout: { [id in PresetIdBreakout]: CompanionPresetExt | undefined } = GetPresetsBreakout()

	const presetRecording: { [id in PresetIdRecording]: CompanionPresetExt | undefined } = GetPresetsRecording()

	const presetDataCustom: { [id in PresetIdDataCustom]: CompanionPresetExt | undefined } = GetPresetsDataCustom()

	const presets: {
		[id in
			| PresetIdRecording
			| PresetIdManageSelections
			| PresetIdGroups
			| PresetIdPinSpotlightViewActions
			| PresetIdVideoAudioActions
			| PresetIdZoomISOSelections
			| PresetIdZoomISOActions
			| PresetIdReactionName
			| PresetIdRoleManagement
			| PresetIdJoinLeaveEnd
			| PresetIdDeviceSettings
			| PresetIdChat
			| PresetIdSharing
			| PresetIdBreakout
			| PresetIdDataCustom
			| PresetIdListParticipants
			| PresetIdListGallery]: CompanionPresetExt | undefined
	} = {
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

	return presets as CompanionPresetDefinitions
}
