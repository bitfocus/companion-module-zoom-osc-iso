import type {
	CompanionActionDefinition,
	CompanionActionDefinitions,
	CompanionOptionValues,
} from '@companion-module/base'
import type { ZoomConfig } from './config.js'
import type { InstanceBaseExt } from './utils.js'

export type ActionsSchema = Record<
	string,
	{
		options: CompanionOptionValues
	}
>

import { ActionIdGroups, GetActionsGroups } from './actions/action-group.js'
import { ActionIdGallery, GetActionsGallery } from './actions/action-gallery.js'
import { ActionIdGlobalBreakoutRooms, GetActionsGlobalBreakoutRooms } from './actions/action-global-breakout-rooms.js'
import {
	ActionIdGlobalMemoryManagement,
	GetActionsGlobalMemoryManagement,
} from './actions/action-global-memory-management.js'
import {
	ActionIdGlobalGalleryTrackingAndDataRequest,
	GetActionsGlobalGalleryTrackingAndDataRequest,
} from './actions/action-global-gallery-tracking-and-data-request.js'
import { ActionIdGlobalRecording, GetActionsGlobalRecording } from './actions/action-global-recording.js'
import {
	ActionIdGlobalWaitingRoomsAndZak,
	GetActionsGlobalWaitingRoomsAndZak,
} from './actions/action-global-waitingrooms-and-zak.js'
import { ActionIdGlobal, GetActionsGlobal } from './actions/action-global.js'
import { ActionIdUserBreakoutRooms, GetActionsUserBreakoutRooms } from './actions/action-user-breakout-rooms.js'
import { ActionIdUserChat, GetActionsUserChat } from './actions/action-user-chat.js'
import { ActionIdUserHandRaised, GetActionsUserHandRaised } from './actions/action-user-hand-raised.js'
import { ActionIdUserPin, GetActionsUserPin } from './actions/action-user-pin.js'
import { ActionIdUserRolesAndAction, GetActionsUserRolesAndAction } from './actions/action-user-roles-action.js'
import { ActionIdUserScreenshare, GetActionsUserScreenshare } from './actions/action-user-screenshare.js'
import { ActionIdUserSettings, GetActionsUserSettings } from './actions/action-user-settings.js'
import { ActionIdUserSpotlight, GetActionsUserSpotlight } from './actions/action-user-spotlight.js'
import { ActionIdUserVideoMic, GetActionsUserVideoMic } from './actions/action-user-video-mic.js'
import { ActionIdUserView, GetActionsUserView } from './actions/action-user-view.js'
import { ActionIdUserWaitingRoom, GetActionsUserWaitingRoom } from './actions/action-user-waiting-room.js'
import { ActionIdUserWebinar, GetActionsUserWebinar } from './actions/action-user-webinars.js'
import { ActionIdZoomISOEngine, GetActionsZoomISOEngine } from './actions/action-zoomiso-engine.js'
import {
	ActionIdZoomISOOutputSettings,
	GetActionsZoomISOOutputSettings,
} from './actions/action-zoomiso-output-settings.js'
import { ActionIdZoomISORouting, GetActionsZoomISORouting } from './actions/action-zoomiso-routing.js'
import { ActionIdZoomISOActions, GetActionsZoomISOActions } from './actions/action-zoomiso-actions.js'
import { ActionIdUsers, GetActionsUsers } from './actions/action-user.js'
import { ActionIdSocialStream, GetActionsSocalSteam } from './actions/action-social-stream.js'
import { ActionIdCustom, GetActionsCustom } from './actions/action-custom.js'
import {
	ActionIdZoomISORecordingConsent,
	GetActionsZoomISORecordingConsent,
} from './actions/action-zoomiso-recording-consent.js'

function prefixActionNames<T extends string>(
	prefix: string,
	actions: Record<T, CompanionActionDefinition | undefined>,
): Record<T, CompanionActionDefinition | undefined> {
	return Object.fromEntries(
		Object.entries(actions).map(([id, action]) => [
			id,
			action && typeof action === 'object' && 'name' in action
				? { ...action, name: `${prefix}: ${action.name}` }
				: action,
		]),
	) as Record<T, CompanionActionDefinition | undefined>
}

/**
 * Main function to create the actions
 * @param instance Give the instance so we can extract data
 * @returns CompanionActions
 */
export function GetActions(instance: InstanceBaseExt<ZoomConfig>): CompanionActionDefinitions<ActionsSchema> {
	const actionsGroups: { [id in ActionIdGroups]: CompanionActionDefinition | undefined } = prefixActionNames(
		'Groups',
		GetActionsGroups(instance),
	)

	const actionsGallery: { [id in ActionIdGallery]: CompanionActionDefinition | undefined } = prefixActionNames(
		'Gallery',
		GetActionsGallery(instance),
	)

	const actionUserVideoMic: { [id in ActionIdUserVideoMic]: CompanionActionDefinition | undefined } = prefixActionNames(
		'User Video/Mic',
		GetActionsUserVideoMic(instance),
	)

	const actionUserSpotlight: { [id in ActionIdUserSpotlight]: CompanionActionDefinition | undefined } =
		prefixActionNames('User Spotlight', GetActionsUserSpotlight(instance))

	const actionUserHandRaised: { [id in ActionIdUserHandRaised]: CompanionActionDefinition | undefined } =
		prefixActionNames('User Hand Raised', GetActionsUserHandRaised(instance))

	const actionUserPin: { [id in ActionIdUserPin]: CompanionActionDefinition | undefined } = prefixActionNames(
		'User Pin',
		GetActionsUserPin(instance),
	)

	const actionUserView: { [id in ActionIdUserView]: CompanionActionDefinition | undefined } = prefixActionNames(
		'User View',
		GetActionsUserView(instance),
	)

	const actionGlobalGalleryTrackingAndDataRequest: {
		[id in ActionIdGlobalGalleryTrackingAndDataRequest]: CompanionActionDefinition | undefined
	} = prefixActionNames(
		'Global Gallery Tracking and Data Request',
		GetActionsGlobalGalleryTrackingAndDataRequest(instance),
	)

	const actionUserRolesAndAction: { [id in ActionIdUserRolesAndAction]: CompanionActionDefinition | undefined } =
		prefixActionNames('User Roles and Action', GetActionsUserRolesAndAction(instance))

	const actionUserChat: { [id in ActionIdUserChat]: CompanionActionDefinition | undefined } = prefixActionNames(
		'User Chat',
		GetActionsUserChat(instance),
	)

	const actionUserWebinar: { [id in ActionIdUserWebinar]: CompanionActionDefinition | undefined } = prefixActionNames(
		'User Webinar',
		GetActionsUserWebinar(instance),
	)

	const actionUserBreakoutRooms: { [id in ActionIdUserBreakoutRooms]: CompanionActionDefinition | undefined } =
		prefixActionNames('User Breakout Rooms', GetActionsUserBreakoutRooms(instance))

	const actionUserWaitingRoom: { [id in ActionIdUserWaitingRoom]: CompanionActionDefinition | undefined } =
		prefixActionNames('User Waiting Room', GetActionsUserWaitingRoom(instance))

	const actionUserSharescreen: { [id in ActionIdUserScreenshare]: CompanionActionDefinition | undefined } =
		prefixActionNames('User Screenshare', GetActionsUserScreenshare(instance))

	const actionUserSettings: { [id in ActionIdUserSettings]: CompanionActionDefinition | undefined } = prefixActionNames(
		'User Settings',
		GetActionsUserSettings(instance),
	)

	const actionGlobal: { [id in ActionIdGlobal]: CompanionActionDefinition | undefined } = prefixActionNames(
		'Global',
		GetActionsGlobal(instance),
	)

	const actionGlobalBreakoutRooms: { [id in ActionIdGlobalBreakoutRooms]: CompanionActionDefinition | undefined } =
		prefixActionNames('Global Breakout Rooms', GetActionsGlobalBreakoutRooms(instance))

	const actionGlobalRecording: { [id in ActionIdGlobalRecording]: CompanionActionDefinition | undefined } =
		prefixActionNames('Global Recording', GetActionsGlobalRecording(instance))

	const actionGlobalWaitingRoomsAndZak: {
		[id in ActionIdGlobalWaitingRoomsAndZak]: CompanionActionDefinition | undefined
	} = prefixActionNames('Global Waiting Rooms and ZAK', GetActionsGlobalWaitingRoomsAndZak(instance))

	const actionGlobalMemoryManagement: {
		[id in ActionIdGlobalMemoryManagement]: CompanionActionDefinition | undefined
	} = prefixActionNames('Global Memory Management', GetActionsGlobalMemoryManagement(instance))

	const actionZoomISORouting: { [id in ActionIdZoomISORouting]: CompanionActionDefinition | undefined } =
		prefixActionNames('ZoomISO Routing', GetActionsZoomISORouting(instance))

	const actionZoomISOEngine: { [id in ActionIdZoomISOEngine]: CompanionActionDefinition | undefined } =
		prefixActionNames('ZoomISO Engine', GetActionsZoomISOEngine(instance))

	const actionZoomISOOutputSettings: { [id in ActionIdZoomISOOutputSettings]: CompanionActionDefinition | undefined } =
		prefixActionNames('ZoomISO Output Settings', GetActionsZoomISOOutputSettings(instance))

	const actionZoomISOActions: { [id in ActionIdZoomISOActions]: CompanionActionDefinition | undefined } =
		prefixActionNames('ZoomISO Actions', GetActionsZoomISOActions(instance))

	const actionUsers: { [id in ActionIdUsers]: CompanionActionDefinition | undefined } = prefixActionNames(
		'Users',
		GetActionsUsers(instance),
	)

	const actionSocialStream: { [id in ActionIdSocialStream]: CompanionActionDefinition | undefined } = prefixActionNames(
		'Social Stream',
		GetActionsSocalSteam(instance),
	)

	const actionCustom: { [id in ActionIdCustom]: CompanionActionDefinition | undefined } = prefixActionNames(
		'Custom',
		GetActionsCustom(instance),
	)

	const actionZoomISORecordingConsent: {
		[id in ActionIdZoomISORecordingConsent]: CompanionActionDefinition | undefined
	} = prefixActionNames('ZoomISO Recording Consent', GetActionsZoomISORecordingConsent(instance))

	const actions: {
		[id in
			| ActionIdZoomISORecordingConsent
			| ActionIdCustom
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
			| ActionIdZoomISOActions
			| ActionIdUsers
			| ActionIdSocialStream
			| ActionIdZoomISORouting]: CompanionActionDefinition | undefined
	} = {
		...actionsGroups,
		...actionsGallery,
		...actionUserVideoMic,
		...actionUserSpotlight,
		...actionUserHandRaised,
		...actionUserPin,
		...actionUserView,
		...actionGlobalGalleryTrackingAndDataRequest,
		...actionUserRolesAndAction,
		...actionUserChat,
		...actionUserWebinar,
		...actionUserBreakoutRooms,
		...actionUserWaitingRoom,
		...actionUserSharescreen,
		...actionUserSettings,
		...actionGlobal,
		...actionGlobalBreakoutRooms,
		...actionGlobalRecording,
		...actionGlobalWaitingRoomsAndZak,
		...actionGlobalMemoryManagement,
		...actionZoomISORouting,
		...actionZoomISOEngine,
		...actionZoomISOOutputSettings,
		...actionZoomISOActions,
		...actionUsers,
		...actionSocialStream,
		...actionCustom,
		...actionZoomISORecordingConsent,
	}

	return actions
}
