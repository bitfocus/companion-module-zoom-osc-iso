import {
	CompanionButtonPresetDefinition,
	CompanionButtonStyleProps,
	CompanionFeedbackButtonStyleResult,
} from '@companion-module/base'
import { ActionId } from '../actions'
import { FeedbackId } from '../feedback'
import { InstanceBaseExt, colorBlack, colorDarkGray, colorDarkRed, colorWhite } from '../utils'
import { ActionIdGroups } from '../actions/action-group'
import { ActionIdGallery } from '../actions/action-gallery'
import { ActionIdGlobalBreakoutRooms } from '../actions/action-global-breakout-rooms'
import { ActionIdGlobalMemoryManagement } from '../actions/action-global-memory-management'
import { ActionIdGlobalGalleryTrackingAndDataRequest } from '../actions/action-global-gallery-tracking-and-data-request'
import { ActionIdGlobalRecording } from '../actions/action-global-recording'
import { ActionIdGlobalWaitingRoomsAndZak } from '../actions/action-global-waitingrooms-and-zak'
import { ActionIdGlobal } from '../actions/action-global'
import { ActionIdUserBreakoutRooms } from '../actions/action-user-breakout-rooms'
import { ActionIdUserChat } from '../actions/action-user-chat'
import { ActionIdUserHandRaised } from '../actions/action-user-hand-raised'
import { ActionIdUserPin } from '../actions/action-user-pin'
import { ActionIdUserRolesAndAction } from '../actions/action-user-roles-action'
import { ActionIdUserScreenshare } from '../actions/action-user-screenshare'
import { ActionIdUserSettings } from '../actions/action-user-settings'
import { ActionIdUserSpotlight } from '../actions/action-user-spotlight'
import { ActionIdUserVideoMic } from '../actions/action-user-video-mic'
import { ActionIdUserView } from '../actions/action-user-view'
import { ActionIdUserWaitingRoom } from '../actions/action-user-waiting-room'
import { ActionIdUserWebinar } from '../actions/action-user-webinars'
import { ActionIdZoomISOEngine } from '../actions/action-zoomiso-engine'
import { ActionIdZoomISOOutputSettings } from '../actions/action-zoomiso-output-settings'
import { ActionIdZoomISORouting } from '../actions/action-zoomiso-routing'
import { ActionIdZoomISOActions } from '../actions/action-zoomiso-actions'
import { ActionIdUsers } from '../actions/action-user'
import { ZoomConfig } from '../config'

export type PresetFeedbackDefinition = Array<
	{
		feedbackId: FeedbackId
	} & CompanionButtonPresetDefinition['feedbacks'][0]
>

export interface CompanionPresetExt extends CompanionButtonPresetDefinition {
	feedbacks: PresetFeedbackDefinition
	steps: Array<{
		down: Array<
			{
				actionId:
					| ActionId
					| ActionIdGroups
					| ActionIdGallery
					| ActionIdGlobalBreakoutRooms
					| ActionIdGlobalMemoryManagement
					| ActionIdGlobalGalleryTrackingAndDataRequest
					| ActionIdGlobalRecording
					| ActionIdGlobalWaitingRoomsAndZak
					| ActionIdGlobal
					| ActionIdUserBreakoutRooms
					| ActionIdUserChat
					| ActionIdUserHandRaised
					| ActionIdUserPin
					| ActionIdUserRolesAndAction
					| ActionIdUserScreenshare
					| ActionIdUserSettings
					| ActionIdUserSpotlight
					| ActionIdUserVideoMic
					| ActionIdUserView
					| ActionIdUserWaitingRoom
					| ActionIdUserWebinar
					| ActionIdZoomISOEngine
					| ActionIdZoomISOOutputSettings
					| ActionIdZoomISORouting
					| ActionIdZoomISOActions
					| ActionIdUsers
			} & CompanionButtonPresetDefinition['steps'][0]['down'][0]
		>
		up: Array<
			{
				actionId:
					| ActionId
					| ActionIdGroups
					| ActionIdGallery
					| ActionIdGlobalBreakoutRooms
					| ActionIdGlobalMemoryManagement
					| ActionIdGlobalGalleryTrackingAndDataRequest
					| ActionIdGlobalRecording
					| ActionIdGlobalWaitingRoomsAndZak
					| ActionIdGlobal
					| ActionIdUserBreakoutRooms
					| ActionIdUserChat
					| ActionIdUserHandRaised
					| ActionIdUserPin
					| ActionIdUserRolesAndAction
					| ActionIdUserScreenshare
					| ActionIdUserSettings
					| ActionIdUserSpotlight
					| ActionIdUserVideoMic
					| ActionIdUserView
					| ActionIdUserWaitingRoom
					| ActionIdUserWebinar
					| ActionIdZoomISOEngine
					| ActionIdZoomISOOutputSettings
					| ActionIdZoomISORouting
					| ActionIdZoomISOActions
					| ActionIdUsers
			} & CompanionButtonPresetDefinition['steps'][0]['up'][0]
		>
	}>
}
export interface CompanionPresetDefinitionsExt {
	[id: string]: CompanionPresetExt | undefined
}

export const buttonTextDefaultLength = 50
export const buttonTextActiveSpeakerLength = 40
export const alignmentTopLeft = 'left:top'
export const alignmentTopCenter = 'center:top'

export const getFeedbackStyleSelected = (): CompanionFeedbackButtonStyleResult => {
	return {
		color: colorBlack,
		bgcolor: colorDarkGray,
	}
}

export const getFeedbackStyleSpotlight = (): CompanionFeedbackButtonStyleResult => {
	return {
		color: colorWhite,
		bgcolor: colorDarkRed,
	}
}

export const getParticipantStyleDefault = (
	instance: InstanceBaseExt<ZoomConfig>,
	text: string,
	position: number
): CompanionButtonStyleProps => {
	return {
		text:
			instance.config.feedbackImagesWithIcons === 4
				? `${position}. ${text}`
				: `\`${position}. \${substr(${text},0,${buttonTextDefaultLength})}\``,
		size: '7',
		color: colorWhite,
		bgcolor: colorBlack,
		alignment: alignmentTopCenter,
		show_topbar: false,
		textExpression: instance.config.feedbackImagesWithIcons === 4 ? false : true,
	} as CompanionButtonStyleProps
}

export const getParticipantStyleActiveSpeaker = (text: string, position: number): CompanionButtonStyleProps => {
	return {
		text: `\`\\n${position}. \${substr(${text},0,${buttonTextActiveSpeakerLength})}\``,
		alignment: alignmentTopLeft,
	} as CompanionButtonStyleProps
}
