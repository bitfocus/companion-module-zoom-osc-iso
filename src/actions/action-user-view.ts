import { CompanionActionDefinition } from '@companion-module/base'
import { ZoomConfig } from '../config'
import { InstanceBaseExt } from '../utils'
import { createCommand, sendActionCommand } from './action-utils'
import { ActionIdGlobalGalleryTrackingAndDataRequest } from './action-global-gallery-tracking-and-data-request'

export enum ActionIdUserView {
	setGalleryView = 'setGalleryView',
	setSpeakerView = 'setSpeakerView',
	gotoNextGalleryPage = 'gotoNextGalleryPage',
	gotoPreviousGalleryPage = 'gotoPreviousGalleryPage',
}

export function GetActionsUserView(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdUserView]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdUserView]: CompanionActionDefinition | undefined } = {
		[ActionIdUserView.gotoNextGalleryPage]: {
			name: 'Goto Next Gallery Page',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/galleryPageNext')
				const sendToCommand = {
					id: ActionIdUserView.gotoNextGalleryPage,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				const sendToCommandFollowUp = {
					id: ActionIdGlobalGalleryTrackingAndDataRequest.requestOrderOfGalleryView,
					options: {
						command: '/zoom/getGalleryOrder',
						args: [],
					},
				}
				sendActionCommand(instance, sendToCommand)
				sendActionCommand(instance, sendToCommandFollowUp)
			},
		},
		[ActionIdUserView.gotoPreviousGalleryPage]: {
			name: 'Goto Previous Gallery Page',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/galleryPagePrev')
				const sendToCommand = {
					id: ActionIdUserView.gotoPreviousGalleryPage,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				const sendToCommandFollowUp = {
					id: ActionIdGlobalGalleryTrackingAndDataRequest.requestOrderOfGalleryView,
					options: {
						command: '/zoom/getGalleryOrder',
						args: [],
					},
				}
				sendActionCommand(instance, sendToCommand)
				sendActionCommand(instance, sendToCommandFollowUp)
			},
		},
		[ActionIdUserView.setSpeakerView]: {
			name: 'Set Speaker View',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/setSpeakerView')
				const sendToCommand = {
					id: ActionIdUserView.setSpeakerView,
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdUserView.setGalleryView]: {
			name: 'Set Gallery View',
			options: [],
			callback: (): void => {
				// type: 'Global'
				const command = createCommand(instance, '/me/setGalleryView')
				const sendToCommand = {
					id: ActionIdUserView.setGalleryView,
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
