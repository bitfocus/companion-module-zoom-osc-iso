import { CompanionActionDefinition, CompanionActionDefinitions } from '@companion-module/base'
import { ZoomConfig } from './config.js'
import { InstanceBaseExt, options } from './utils.js'

import { createCommand, sendActionCommand } from './actions/action-utils.js'
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

export enum ActionId {
	loadISOConfig = 'load_ISO_Config',
	saveISOConfig = 'save_ISO_Config',
	mergeISOConfig = 'merge_ISO_Config',
	getConfigPath = 'get_Config_Path',
	acceptRecordingConsent = 'accept_Recording_Consent',
	customCommandWithArguments = 'customCommandWithArguments',
	customCommand = 'customCommand',
}

/**
 * Main function to create the actions
 * @param instance Give the instance so we can extract data
 * @returns CompanionActions
 */
export function GetActions(instance: InstanceBaseExt<ZoomConfig>): CompanionActionDefinitions {
	const actionsGroups: { [id in ActionIdGroups]: CompanionActionDefinition | undefined } = GetActionsGroups(instance)

	const actionsGallery: { [id in ActionIdGallery]: CompanionActionDefinition | undefined } = GetActionsGallery(instance)

	const actionUserVideoMic: { [id in ActionIdUserVideoMic]: CompanionActionDefinition | undefined } =
		GetActionsUserVideoMic(instance)

	const actionUserSpotlight: { [id in ActionIdUserSpotlight]: CompanionActionDefinition | undefined } =
		GetActionsUserSpotlight(instance)

	const actionUserHandRaised: { [id in ActionIdUserHandRaised]: CompanionActionDefinition | undefined } =
		GetActionsUserHandRaised(instance)

	const actionUserPin: { [id in ActionIdUserPin]: CompanionActionDefinition | undefined } = GetActionsUserPin(instance)

	const actionUserView: { [id in ActionIdUserView]: CompanionActionDefinition | undefined } =
		GetActionsUserView(instance)

	const actionGlobalGalleryTrackingAndDataRequest: {
		[id in ActionIdGlobalGalleryTrackingAndDataRequest]: CompanionActionDefinition | undefined
	} = GetActionsGlobalGalleryTrackingAndDataRequest(instance)

	const actionUserRolesAndAction: { [id in ActionIdUserRolesAndAction]: CompanionActionDefinition | undefined } =
		GetActionsUserRolesAndAction(instance)

	const actionUserChat: { [id in ActionIdUserChat]: CompanionActionDefinition | undefined } =
		GetActionsUserChat(instance)

	const actionUserWebinar: { [id in ActionIdUserWebinar]: CompanionActionDefinition | undefined } =
		GetActionsUserWebinar(instance)

	const actionUserBreakoutRooms: { [id in ActionIdUserBreakoutRooms]: CompanionActionDefinition | undefined } =
		GetActionsUserBreakoutRooms(instance)

	const actionUserWaitingRoom: { [id in ActionIdUserWaitingRoom]: CompanionActionDefinition | undefined } =
		GetActionsUserWaitingRoom(instance)

	const actionUserSharescreen: { [id in ActionIdUserScreenshare]: CompanionActionDefinition | undefined } =
		GetActionsUserScreenshare(instance)

	const actionUserSettings: { [id in ActionIdUserSettings]: CompanionActionDefinition | undefined } =
		GetActionsUserSettings(instance)

	const actionGlobal: { [id in ActionIdGlobal]: CompanionActionDefinition | undefined } = GetActionsGlobal(instance)

	const actionGlobalBreakoutRooms: { [id in ActionIdGlobalBreakoutRooms]: CompanionActionDefinition | undefined } =
		GetActionsGlobalBreakoutRooms(instance)

	const actionGlobalRecording: { [id in ActionIdGlobalRecording]: CompanionActionDefinition | undefined } =
		GetActionsGlobalRecording(instance)

	const actionGlobalWaitingRoomsAndZak: {
		[id in ActionIdGlobalWaitingRoomsAndZak]: CompanionActionDefinition | undefined
	} = GetActionsGlobalWaitingRoomsAndZak(instance)

	const actionGlobalMemoryManagement: {
		[id in ActionIdGlobalMemoryManagement]: CompanionActionDefinition | undefined
	} = GetActionsGlobalMemoryManagement(instance)

	const actionZoomISORouting: { [id in ActionIdZoomISORouting]: CompanionActionDefinition | undefined } =
		GetActionsZoomISORouting(instance)

	const actionZoomISOEngine: { [id in ActionIdZoomISOEngine]: CompanionActionDefinition | undefined } =
		GetActionsZoomISOEngine(instance)

	const actionZoomISOOutputSettings: { [id in ActionIdZoomISOOutputSettings]: CompanionActionDefinition | undefined } =
		GetActionsZoomISOOutputSettings(instance)

	const actionZoomISOActions: { [id in ActionIdZoomISOActions]: CompanionActionDefinition | undefined } =
		GetActionsZoomISOActions(instance)

	const actionUsers: { [id in ActionIdUsers]: CompanionActionDefinition | undefined } = GetActionsUsers(instance)

	const actions: {
		[id in
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
			| ActionIdZoomISOActions
			| ActionIdUsers
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
		[ActionId.loadISOConfig]: {
			name: 'Load Config',
			options: [options.path],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/loadConfig')
				command.args.push({ type: 'i', value: action.options.path })
				const sendToCommand = {
					id: ActionId.loadISOConfig,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionId.saveISOConfig]: {
			name: 'Save Config',
			options: [options.path],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/saveConfig')
				command.args.push({ type: 'i', value: action.options.path })
				const sendToCommand = {
					id: ActionId.saveISOConfig,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionId.mergeISOConfig]: {
			name: 'Merge Config',
			options: [options.path],
			callback: (action): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/mergeConfig')
				command.args.push({ type: 'i', value: action.options.path })
				const sendToCommand = {
					id: ActionId.mergeISOConfig,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionId.getConfigPath]: {
			name: 'getConfig path',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/getConfigPath')
				const sendToCommand = {
					id: ActionId.getConfigPath,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionId.acceptRecordingConsent]: {
			name: 'Accept Recording Consent',
			options: [],
			callback: (): void => {
				// type: 'ISO'
				const command = createCommand(instance, '/acceptRecordingConsent')
				const sendToCommand = {
					id: ActionId.acceptRecordingConsent,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionId.customCommand]: {
			name: 'Custom command',
			options: [options.path],
			callback: async (action): Promise<void> => {
				// type: 'Special'
				const customPath = await instance.parseVariablesInString(action.options.path as string)
				// Did they try a JSON object?
				if (customPath.startsWith('{')) {
					try {
						const convertedString = JSON.parse(customPath)
						const command = createCommand(instance, convertedString)
						const sendToCommand = {
							id: ActionId.customCommand,
							options: {
								command: command.oscPath,
								args: command.args,
							},
						}
						sendActionCommand(instance, sendToCommand)
					} catch (error) {
						instance.log('error', `Not a JSON value, ${customPath}`)
					}
				} else {
					const command = createCommand(instance, customPath)
					const sendToCommand = {
						id: ActionId.customCommand,
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}
					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionId.customCommandWithArguments]: {
			name: 'Custom w/args',
			options: [options.path, options.customArgs],
			callback: (action): void => {
				// type: 'Special'
				const command = createCommand(instance, action.options.path as string)
				command.args.push(JSON.parse(action.options.customArgs as string))
				const sendToCommand = {
					id: ActionId.customCommandWithArguments,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
	}

	return actions
}
