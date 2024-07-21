import {
	CompanionButtonPresetDefinition,
	CompanionButtonStyleProps,
	CompanionFeedbackButtonStyleResult,
} from '@companion-module/base'
import { ActionId } from '../actions.js'
import { FeedbackId } from '../feedback.js'
import { InstanceBaseExt, colorBlack, colorDarkGray, colorDarkRed, colorWhite } from '../utils.js'
import { ActionIdGroups } from '../actions/action-group.js'
import { ActionIdGallery } from '../actions/action-gallery.js'
import { ActionIdGlobalBreakoutRooms } from '../actions/action-global-breakout-rooms.js'
import { ActionIdGlobalMemoryManagement } from '../actions/action-global-memory-management.js'
import { ActionIdGlobalGalleryTrackingAndDataRequest } from '../actions/action-global-gallery-tracking-and-data-request.js'
import { ActionIdGlobalRecording } from '../actions/action-global-recording.js'
import { ActionIdGlobalWaitingRoomsAndZak } from '../actions/action-global-waitingrooms-and-zak.js'
import { ActionIdGlobal } from '../actions/action-global.js'
import { ActionIdUserBreakoutRooms } from '../actions/action-user-breakout-rooms.js'
import { ActionIdUserChat } from '../actions/action-user-chat.js'
import { ActionIdUserHandRaised } from '../actions/action-user-hand-raised.js'
import { ActionIdUserPin } from '../actions/action-user-pin.js'
import { ActionIdUserRolesAndAction } from '../actions/action-user-roles-action.js'
import { ActionIdUserScreenshare } from '../actions/action-user-screenshare.js'
import { ActionIdUserSettings } from '../actions/action-user-settings.js'
import { ActionIdUserSpotlight } from '../actions/action-user-spotlight.js'
import { ActionIdUserVideoMic } from '../actions/action-user-video-mic.js'
import { ActionIdUserView } from '../actions/action-user-view.js'
import { ActionIdUserWaitingRoom } from '../actions/action-user-waiting-room.js'
import { ActionIdUserWebinar } from '../actions/action-user-webinars.js'
import { ActionIdZoomISOEngine } from '../actions/action-zoomiso-engine.js'
import { ActionIdZoomISOOutputSettings } from '../actions/action-zoomiso-output-settings.js'
import { ActionIdZoomISORouting } from '../actions/action-zoomiso-routing.js'
import { ActionIdZoomISOActions } from '../actions/action-zoomiso-actions.js'
import { ActionIdUsers } from '../actions/action-user.js'
import { ZoomConfig } from '../config.js'

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
): any => {
	return {
		text:
			instance.config.feedbackImagesWithIcons === 4
				? `${position}. ${text}`
				: `\`${position}. \${substr(${text},0,${buttonTextDefaultLength})}\``,
		size: '10',
		color: colorWhite,
		bgcolor: colorBlack,
		alignment: alignmentTopCenter,
		show_topbar: false,
		textExpression: instance.config.feedbackImagesWithIcons === 4 ? false : true,
	} //as CompanionButtonStyleProps
}

export const getParticipantStyleActiveSpeaker = (text: string, position: number): CompanionButtonStyleProps => {
	return {
		text: `\`\\n${position}. \${substr(${text},0,${buttonTextActiveSpeakerLength})}\``,
		alignment: alignmentTopLeft,
	} as CompanionButtonStyleProps
}
