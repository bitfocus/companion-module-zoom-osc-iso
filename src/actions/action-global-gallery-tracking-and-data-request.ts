import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt } from '../utils.js'
import { createCommand, sendActionCommand } from './action-utils.js'

export enum ActionIdGlobalGalleryTrackingAndDataRequest {
	// gallery track mode
	// subscription level
	requestOrderOfGalleryView = 'requestOrderOfGalleryView',
	requestGalleryCount = 'requestGalleryCount',
	requestOrderOfSpotlights = 'requestOrderOfSpotlights',
}

export function GetActionsGlobalGalleryTrackingAndDataRequest(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdGlobalGalleryTrackingAndDataRequest]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdGlobalGalleryTrackingAndDataRequest]: CompanionActionDefinition | undefined } = {
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
		[ActionIdGlobalGalleryTrackingAndDataRequest.requestGalleryCount]: {
			name: 'Request GalleryCount',
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
