import {
	CompanionButtonPresetDefinition,
	CompanionButtonStyleProps,
	CompanionFeedbackButtonStyleResult,
} from '@companion-module/base'
import { ActionId } from '../actions'
import { FeedbackId } from '../feedback'
import { colorBlack, colorDarkGray, colorWhite } from '../utils'
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

export interface CompanionPresetExt extends CompanionButtonPresetDefinition {
	feedbacks: Array<
		{
			feedbackId: FeedbackId
		} & CompanionButtonPresetDefinition['feedbacks'][0]
	>
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
export const alignmentTopLeft = 'left:top'
export const alignmentTopCenter = 'center:top'
export const getFeedbackStyleSelected = (): CompanionFeedbackButtonStyleResult => {
	return {
		color: colorBlack,
		bgcolor: colorDarkGray,
	}
}

export const getParticipantStyleDefault = (text: string, position: number): CompanionButtonStyleProps => {
	return {
		text: `\\n${position}. ${text})`,
		size: '7',
		color: colorWhite,
		bgcolor: colorBlack,
		alignment: alignmentTopCenter,
	}
}
