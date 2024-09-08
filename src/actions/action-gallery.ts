import { CompanionActionDefinition, CompanionVariableValues } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt } from '../utils.js'
import { FeedbackId } from '../feedback.js'
import { PreviousSelectedCallersSave, positionOrderOption, selectUser } from './action-utils.js'
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
				const zoomId = instance.ZoomClientDataObj.galleryOrder[(action.options.position as number) - 1]

				selectUser(instance, zoomId, action.options.option as string)
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
					FeedbackId.groupBasedAdvanced,
				)
			},
		},
	}

	return actions
}
