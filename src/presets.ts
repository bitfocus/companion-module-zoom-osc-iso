import { CompanionPresetDefinitions } from '@companion-module/base'

import { InstanceBaseExt, ZoomAudioRoutingDataInterface, ZoomGroupDataInterface, ZoomUserDataInterface } from './utils'
import { CompanionPresetDefinitionsExt } from './presets/preset-utils'
import { GetPresetsListParticipants } from './presets/preset-participants'
import { GetPresetsListGallery } from './presets/preset-gallery'
import { GetPresetsManageSelections } from './presets/preset-manage-selections'
import { GetPresetsGroups } from './presets/preset-groups'
import { GetPresetsPinSpotlightViewActions } from './presets/preset-pin-spotlight-view'
import { GetPresetsVideoAudioActions } from './presets/preset-video-audio-actions'
import { GetPresetsZoomISOSelections } from './presets/preset-zoomiso-selections'
import { GetPresetsZoomISOActions } from './presets/preset-zoomiso-actions'
import { GetPresetsReactionName } from './presets/preset-reaction-name'
import { GetPresetsRoleManagement } from './presets/preset-role-management'
import { GetPresetsJoinLeaveEnd } from './presets/preset-join-leave-end'
import { GetPresetsDeviceSettings } from './presets/preset-devices-settings'
import { GetPresetsChat } from './presets/preset-chat'
import { GetPresetsSharing } from './presets/preset-sharing'
import { GetPresetsBreakout } from './presets/preset-breakout'
import { GetPresetsRecording } from './presets/preset-recording'
import { GetPresetsDataCustom } from './presets/preset-data-custom'
import { ZoomConfig } from './config'

export function GetPresetList(
	instance: InstanceBaseExt<ZoomConfig>,
	ZoomGroupData: ZoomGroupDataInterface[],
	ZoomUserData: ZoomUserDataInterface,
	ZoomAudioRoutingData: ZoomAudioRoutingDataInterface
): CompanionPresetDefinitions {
	const presetsParticipants = GetPresetsListParticipants(instance)
	const presetsGallery = GetPresetsListGallery(instance)
	const presetsManageSelections = GetPresetsManageSelections()
	const presetsGroups = GetPresetsGroups(instance, ZoomGroupData)
	const presetsPinSpotlightViewActions = GetPresetsPinSpotlightViewActions()
	const presetsVideoAudioActions = GetPresetsVideoAudioActions()
	const presetsZoomISOSelections = GetPresetsZoomISOSelections(ZoomAudioRoutingData)
	const presetsZoomISOActions = GetPresetsZoomISOActions()
	const presetsReactionNames = GetPresetsReactionName(ZoomUserData)
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
