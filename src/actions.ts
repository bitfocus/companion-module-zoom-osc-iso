import type ModuleInstance from './index.js'
import { GetActionsGroups, type ActionsSchemaGroups } from './actions/action-group.js'
import { GetActionsGallery, type ActionsSchemaGallery } from './actions/action-gallery.js'
import { GetActionsUserVideoMic, type ActionsSchemaUserVideoMic } from './actions/action-user-video-mic.js'
import { GetActionsUserSpotlight, type ActionsSchemaUserSpotlight } from './actions/action-user-spotlight.js'
import { GetActionsUserHandRaised, type ActionsSchemaUserHandRaised } from './actions/action-user-hand-raised.js'
import { GetActionsUserPin, type ActionsSchemaUserPin } from './actions/action-user-pin.js'
import { GetActionsUserView, type ActionsSchemaUserView } from './actions/action-user-view.js'
import {
	GetActionsGlobalGalleryTrackingAndDataRequest,
	type ActionsSchemaGlobalGalleryTrackingAndDataRequest,
} from './actions/action-global-gallery-tracking-and-data-request.js'
import {
	GetActionsUserRolesAndAction,
	type ActionsSchemaUserRolesAndAction,
} from './actions/action-user-roles-action.js'
import { GetActionsUserChat, type ActionsSchemaUserChat } from './actions/action-user-chat.js'
import { GetActionsUserWebinar, type ActionsSchemaUserWebinar } from './actions/action-user-webinars.js'
import {
	GetActionsUserBreakoutRooms,
	type ActionsSchemaUserBreakoutRooms,
} from './actions/action-user-breakout-rooms.js'
import { GetActionsUserWaitingRoom, type ActionsSchemaUserWaitingRoom } from './actions/action-user-waiting-room.js'
import { GetActionsUserScreenshare, type ActionsSchemaUserScreenshare } from './actions/action-user-screenshare.js'
import { GetActionsUserSettings, type ActionsSchemaUserSettings } from './actions/action-user-settings.js'
import { GetActionsGlobal, type ActionsSchemaGlobal } from './actions/action-global.js'
import {
	GetActionsGlobalBreakoutRooms,
	type ActionsSchemaGlobalBreakoutRooms,
} from './actions/action-global-breakout-rooms.js'
import { GetActionsGlobalRecording, type ActionsSchemaGlobalRecording } from './actions/action-global-recording.js'
import {
	GetActionsGlobalWaitingRoomsAndZak,
	type ActionsSchemaGlobalWaitingRoomsAndZak,
} from './actions/action-global-waitingrooms-and-zak.js'
import {
	GetActionsGlobalMemoryManagement,
	type ActionsSchemaGlobalMemoryManagement,
} from './actions/action-global-memory-management.js'
import { GetActionsZoomISORouting, type ActionsSchemaZoomISORouting } from './actions/action-zoomiso-routing.js'
import { GetActionsZoomISOEngine, type ActionsSchemaZoomISOEngine } from './actions/action-zoomiso-engine.js'
import {
	GetActionsZoomISOOutputSettings,
	type ActionsSchemaZoomISOOutputSettings,
} from './actions/action-zoomiso-output-settings.js'
import { GetActionsZoomISOActions, type ActionsSchemaZoomISOActions } from './actions/action-zoomiso-actions.js'
import { GetActionsUsers, type ActionsSchemaUsers } from './actions/action-user.js'
import { GetActionsSocalSteam, type ActionsSchemaSocialStream } from './actions/action-social-stream.js'
import { GetActionsCustom, type ActionsSchemaCustom } from './actions/action-custom.js'
import {
	GetActionsZoomISORecordingConsent,
	type ActionsSchemaZoomISORecordingConsent,
} from './actions/action-zoomiso-recording-consent.js'

/** Every action id maps to its typed options. Composed from the per-category schemas. */
export type ActionsSchema = ActionsSchemaGroups &
	ActionsSchemaGallery &
	ActionsSchemaUserVideoMic &
	ActionsSchemaUserSpotlight &
	ActionsSchemaUserHandRaised &
	ActionsSchemaUserPin &
	ActionsSchemaUserView &
	ActionsSchemaGlobalGalleryTrackingAndDataRequest &
	ActionsSchemaUserRolesAndAction &
	ActionsSchemaUserChat &
	ActionsSchemaUserWebinar &
	ActionsSchemaUserBreakoutRooms &
	ActionsSchemaUserWaitingRoom &
	ActionsSchemaUserScreenshare &
	ActionsSchemaUserSettings &
	ActionsSchemaGlobal &
	ActionsSchemaGlobalBreakoutRooms &
	ActionsSchemaGlobalRecording &
	ActionsSchemaGlobalWaitingRoomsAndZak &
	ActionsSchemaGlobalMemoryManagement &
	ActionsSchemaZoomISORouting &
	ActionsSchemaZoomISOEngine &
	ActionsSchemaZoomISOOutputSettings &
	ActionsSchemaZoomISOActions &
	ActionsSchemaUsers &
	ActionsSchemaSocialStream &
	ActionsSchemaCustom &
	ActionsSchemaZoomISORecordingConsent

/**
 * Registers every action with Companion
 * @param instance Give the instance so we can extract data
 */
export function UpdateActions(instance: ModuleInstance): void {
	instance.setActionDefinitions({
		...GetActionsGroups(instance),
		...GetActionsGallery(instance),
		...GetActionsUserVideoMic(instance),
		...GetActionsUserSpotlight(instance),
		...GetActionsUserHandRaised(instance),
		...GetActionsUserPin(instance),
		...GetActionsUserView(instance),
		...GetActionsGlobalGalleryTrackingAndDataRequest(instance),
		...GetActionsUserRolesAndAction(instance),
		...GetActionsUserChat(instance),
		...GetActionsUserWebinar(instance),
		...GetActionsUserBreakoutRooms(instance),
		...GetActionsUserWaitingRoom(instance),
		...GetActionsUserScreenshare(instance),
		...GetActionsUserSettings(instance),
		...GetActionsGlobal(instance),
		...GetActionsGlobalBreakoutRooms(instance),
		...GetActionsGlobalRecording(instance),
		...GetActionsGlobalWaitingRoomsAndZak(instance),
		...GetActionsGlobalMemoryManagement(instance),
		...GetActionsZoomISORouting(instance),
		...GetActionsZoomISOEngine(instance),
		...GetActionsZoomISOOutputSettings(instance),
		...GetActionsZoomISOActions(instance),
		...GetActionsUsers(instance),
		...GetActionsSocalSteam(instance),
		...GetActionsCustom(instance),
		...GetActionsZoomISORecordingConsent(instance),
	})
}
