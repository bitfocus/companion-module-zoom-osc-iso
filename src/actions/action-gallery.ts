import type { VariableValues } from '../variables/variable-definitions.js'
import type ModuleInstance from '../index.js'
import type { CompanionActionDefinitions } from '@companion-module/base'
import { FeedbackId } from '../feedback.js'
import { PreviousSelectedCallersSave, positionOrderOption, selectUser } from './action-utils.js'
import { updateSelectedCallersVariables } from '../variables/variable-values.js'

export enum ActionIdGallery {
	selectFromGalleryPosition = 'select_From_Gallery_Position',
}

export type ActionsSchemaGallery = {
	[ActionIdGallery.selectFromGalleryPosition]: { options: { position: string; option: string } }
}

export function GetActionsGallery(instance: ModuleInstance): CompanionActionDefinitions<ActionsSchemaGallery> {
	const actions: CompanionActionDefinitions<ActionsSchemaGallery> = {
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
				const zoomId = instance.ZoomClientDataObj.galleryOrder[Number(action.options.position) - 1]

				selectUser(instance, zoomId, action.options.option)
				// instance.UpdateVariablesValues()
				const variables: VariableValues = {}
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
					FeedbackId.groupBasedAdvanced,
				)
			},
		},
	}

	return actions
}
