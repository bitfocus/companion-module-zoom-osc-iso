import type ModuleInstance from '../index.js'
import type { CompanionActionDefinitions } from '@companion-module/base'
import { createCommand, sendActionCommand } from './action-utils.js'

export enum ActionIdGlobalGalleryTrackingAndDataRequest {
	// gallery track mode
	// subscription level
	requestOrderOfGalleryView = 'requestOrderOfGalleryView',
	requestGalleryCount = 'requestGalleryCount',
	requestGalleryCountNew = 'requestGalleryCountNew',
	requestOrderOfSpotlights = 'requestOrderOfSpotlights',
}

export type ActionsSchemaGlobalGalleryTrackingAndDataRequest = {
	[ActionIdGlobalGalleryTrackingAndDataRequest.requestOrderOfGalleryView]: { options: Record<string, never> }
	[ActionIdGlobalGalleryTrackingAndDataRequest.requestGalleryCount]: { options: Record<string, never> }
	[ActionIdGlobalGalleryTrackingAndDataRequest.requestGalleryCountNew]: { options: Record<string, never> }
	[ActionIdGlobalGalleryTrackingAndDataRequest.requestOrderOfSpotlights]: { options: Record<string, never> }
}

export function GetActionsGlobalGalleryTrackingAndDataRequest(
	instance: ModuleInstance,
): CompanionActionDefinitions<ActionsSchemaGlobalGalleryTrackingAndDataRequest> {
	const actions: CompanionActionDefinitions<ActionsSchemaGlobalGalleryTrackingAndDataRequest> = {
		[ActionIdGlobalGalleryTrackingAndDataRequest.requestOrderOfGalleryView]: {
			name: 'Request Order Of GalleryView',
			options: [],
			callback: (): void => {
				// type: 'Special'
				const command = createCommand(instance, '/getGalleryOrder')
				const sendToCommand = {
					id: ActionIdGlobalGalleryTrackingAndDataRequest.requestOrderOfGalleryView,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalGalleryTrackingAndDataRequest.requestGalleryCountNew]: {
			name: 'Request GalleryCount (New for OSC v5+ and ISO v3+)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/galleryCount')
				const sendToCommand = {
					id: ActionIdGlobalGalleryTrackingAndDataRequest.requestGalleryCountNew,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalGalleryTrackingAndDataRequest.requestGalleryCount]: {
			name: 'Request GalleryCount (Deprecated.  Use New Gallery Count)',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/galCount')
				const sendToCommand = {
					id: ActionIdGlobalGalleryTrackingAndDataRequest.requestGalleryCount,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGlobalGalleryTrackingAndDataRequest.requestOrderOfSpotlights]: {
			name: 'Request Order Of Spotlights',
			options: [],
			callback: (): void => {
				// type: 'Special'
				const command = createCommand(instance, '/getSpotOrder')
				const sendToCommand = {
					id: ActionIdGlobalGalleryTrackingAndDataRequest.requestOrderOfSpotlights,
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
