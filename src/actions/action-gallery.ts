import { CompanionActionDefinition, CompanionVariableValues } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt, arrayAdd, arrayRemove } from '../utils.js'
import { FeedbackId } from '../feedback.js'
import {
	PreviousSelectedCallersSave,
	positionOrderOption,
	selectionMethod,
	toggleSelectedUser,
} from './action-utils.js'
import { updateSelectedCallersVariables } from '../variables/variable-values.js'

export enum ActionIdGallery {
	selectFromGalleryPosition = 'select_From_Gallery_Position',
}

export function GetActionsGallery(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdGallery]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdGallery]: CompanionActionDefinition | undefined } = {
		[ActionIdGallery.selectFromGalleryPosition]: {
			name: 'Preselect user by Gallery Position',
			options: [
				positionOrderOption,
				{
					type: 'dropdown',
					label: 'Option',
					id: 'option',
					default: '',
					choices: [
						{ label: 'Toggle', id: 'toggle' },
						{ label: 'Select', id: 'select' },
						{ label: 'Remove', id: 'remove' },
					],
				},
			],
			callback: (action) => {
				PreviousSelectedCallersSave(instance)
				const position = (action.options.position as number) - 1
				switch (action.options.option) {
					case 'toggle':
						instance.ZoomClientDataObj.PreviousSelectedCallers = instance.ZoomClientDataObj.selectedCallers
						toggleSelectedUser(instance, instance.ZoomClientDataObj.galleryOrder[position])
						break
					case 'select':
						if (instance.config.selectionMethod === selectionMethod.SingleSelection)
							instance.ZoomClientDataObj.selectedCallers.length = 0
						instance.ZoomClientDataObj.selectedCallers = arrayAdd(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomClientDataObj.galleryOrder[(action.options.position as number) - 1]
						)
						break
					case 'remove':
						instance.ZoomClientDataObj.selectedCallers = arrayRemove(
							instance.ZoomClientDataObj.selectedCallers,
							instance.ZoomClientDataObj.galleryOrder[(action.options.position as number) - 1]
						)
						break
				}
				// instance.UpdateVariablesValues()
				const variables: CompanionVariableValues = {}
				updateSelectedCallersVariables(instance, variables)
				instance.setVariableValues(variables)
				instance.checkFeedbacks(
					FeedbackId.userNameBased,
					FeedbackId.userNameBasedAdvanced,
					FeedbackId.indexBased,
					FeedbackId.indexBasedAdvanced,
					FeedbackId.galleryBased,
					FeedbackId.galleryBasedAdvanced,
					FeedbackId.groupBased,
					FeedbackId.groupBasedAdvanced
				)
			},
		},
	}

	return actions
}
