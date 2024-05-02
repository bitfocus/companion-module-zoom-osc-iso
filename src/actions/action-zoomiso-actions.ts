import { CompanionActionDefinition, SomeCompanionActionInputField } from '@companion-module/base'
import { ZoomConfig } from '../config.js'
import { InstanceBaseExt } from '../utils.js'
import { FeedbackId } from '../feedback.js'
import { sendActionCommand, PreviousSelectedCallersSave } from './action-utils.js'

export enum ActionIdZoomISOActions {
	selectOutput = 'select_Output',
	selectAudioChannel = 'select_Audio_Channel',
	applyOutput = 'apply_Output',
	applyChannel = 'apply_Channel',
	applyOutputs = 'apply_Outputs',
}

export function GetActionsZoomISOActions(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdZoomISOActions]: CompanionActionDefinition | undefined
} {
	const CHOICES_OUTPUTS = []
	// Change this to actual created output, get that with pulling

	for (
		let index = 1;
		index <
		(Object.keys(instance.ZoomAudioRoutingData).length === 0
			? 9
			: Object.keys(instance.ZoomAudioRoutingData).length + 1);
		index++
	) {
		CHOICES_OUTPUTS.push({ id: index, label: `Output ${index}` })
	}

	const outputOption: SomeCompanionActionInputField = {
		type: 'dropdown',
		label: 'Output',
		id: 'output',
		default: 1,
		choices: CHOICES_OUTPUTS,
	}

	const actions: { [id in ActionIdZoomISOActions]: CompanionActionDefinition | undefined } = {
		// ISO Actions
		[ActionIdZoomISOActions.selectOutput]: {
			name: 'Select output',
			options: [outputOption],
			callback: (action) => {
				const outputNumber: number = action.options.output as number
				const index = instance.ZoomClientDataObj.selectedOutputs.indexOf(outputNumber)
				// instance.log('debug', `outputNumber: ${outputNumber} selectedOutputs: ${JSON.stringify(instance.ZoomClientDataObj.selectedOutputs)}`)
				if (index > -1) {
					instance.ZoomClientDataObj.selectedOutputs.splice(index, 1)
				} else {
					instance.ZoomClientDataObj.selectedOutputs.push(outputNumber)
				}
				// instance.log('debug', `outputNumber: ${outputNumber} selectedOutputs: ${JSON.stringify(instance.ZoomClientDataObj.selectedOutputs)}`)
				instance.checkFeedbacks(FeedbackId.output)
			},
		},
		[ActionIdZoomISOActions.selectAudioChannel]: {
			name: 'Select audio channel',
			options: [outputOption],
			callback: (action) => {
				const index = instance.ZoomClientDataObj.selectedAudioOutputs.indexOf(action.options.output as number)
				if (index > -1) {
					instance.ZoomClientDataObj.selectedAudioOutputs.splice(index, 1)
				} else {
					instance.ZoomClientDataObj.selectedAudioOutputs.push(action.options.output as number)
				}
				instance.checkFeedbacks(FeedbackId.audioOutput)
			},
		},
		[ActionIdZoomISOActions.applyOutput]: {
			name: 'Apply output',
			options: [],
			callback: () => {
				const args: { type: string; value: string | number }[] = []
				if (instance.ZoomClientDataObj.selectedCallers[0] && instance.ZoomClientDataObj.selectedOutputs[0]) {
					args.push({ type: 'i', value: instance.ZoomClientDataObj.selectedCallers[0] })
					args.push({ type: 'i', value: instance.ZoomClientDataObj.selectedOutputs[0] })
					const sendToCommand: any = {
						id: 'outputISO',
						options: {
							command: '/zoom/zoomID/outputISO',
							args: args,
						},
					}
					sendActionCommand(instance, sendToCommand)
					// reset arrays
					PreviousSelectedCallersSave(instance)
					// instance.ZoomClientDataObj.selectedCallers.length = 0
					// instance.ZoomClientDataObj.selectedOutputs.length = 0
					instance.UpdateVariablesValues()
					instance.checkFeedbacks(
						FeedbackId.userNameBased,
						FeedbackId.userNameBasedAdvanced,
						FeedbackId.indexBased,
						FeedbackId.indexBasedAdvanced,
						FeedbackId.galleryBased,
						FeedbackId.galleryBasedAdvanced,
						FeedbackId.groupBased,
						FeedbackId.groupBasedAdvanced,
						FeedbackId.output
					)
				}
			},
		},
		[ActionIdZoomISOActions.applyChannel]: {
			name: 'Apply channel',
			options: [],
			callback: () => {
				const args: { type: string; value: string | number }[] = []
				if (instance.ZoomClientDataObj.selectedCallers[0] && instance.ZoomClientDataObj.selectedOutputs[0]) {
					args.push({ type: 'i', value: instance.ZoomClientDataObj.selectedCallers[0] })
					args.push({ type: 'i', value: instance.ZoomClientDataObj.selectedOutputs[0] })
					const sendToCommand: any = {
						id: 'audioISO',
						options: {
							command: '/zoom/zoomID/audioISO',
							args: args,
						},
					}
					sendActionCommand(instance, sendToCommand)
					// reset arrays
					PreviousSelectedCallersSave(instance)
					// instance.ZoomClientDataObj.selectedCallers.length = 0
					// instance.ZoomClientDataObj.selectedOutputs.length = 0
					instance.UpdateVariablesValues()
					instance.checkFeedbacks(
						FeedbackId.userNameBased,
						FeedbackId.userNameBasedAdvanced,
						FeedbackId.indexBased,
						FeedbackId.indexBasedAdvanced,
						FeedbackId.galleryBased,
						FeedbackId.galleryBasedAdvanced,
						FeedbackId.groupBased,
						FeedbackId.groupBasedAdvanced,
						FeedbackId.output
					)
				}
			},
		},
		[ActionIdZoomISOActions.applyOutputs]: {
			name: 'Apply selected outputs',
			options: [],
			callback: () => {
				let args: { type: string; value: string | number }[] = []
				for (let index = 0; index < instance.ZoomClientDataObj.selectedOutputs.length; index++) {
					// only fill up outputs when there are users
					if (instance.ZoomClientDataObj.selectedCallers[index]) {
						args.push({ type: 'i', value: instance.ZoomClientDataObj.selectedCallers[index] })
						args.push({ type: 'i', value: instance.ZoomClientDataObj.selectedOutputs[index] })
					}

					const sendToCommand: any = {
						id: 'outputISO',
						options: {
							command: '/zoom/zoomID/outputISO',
							args: args,
						},
					}
					sendActionCommand(instance, sendToCommand)
					args = []
				}

				// reset arrays
				PreviousSelectedCallersSave(instance)
				// instance.ZoomClientDataObj.selectedCallers.length = 0
				// instance.ZoomClientDataObj.selectedOutputs.length = 0
				instance.UpdateVariablesValues()
				instance.checkFeedbacks(
					FeedbackId.userNameBased,
					FeedbackId.userNameBasedAdvanced,
					FeedbackId.indexBased,
					FeedbackId.indexBasedAdvanced,
					FeedbackId.galleryBased,
					FeedbackId.galleryBasedAdvanced,
					FeedbackId.groupBased,
					FeedbackId.groupBasedAdvanced,
					FeedbackId.output
				)
			},
		},
	}

	return actions
}
