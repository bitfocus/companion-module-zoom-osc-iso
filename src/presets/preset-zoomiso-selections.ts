import { FeedbackId } from '../feedback.js'
import { InstanceBaseExt, colorBlack, colorGreenOlive, colorRed } from '../utils.js'
import { CompanionPresetDefinitionsExt } from './preset-utils.js'
import { ActionIdZoomISOActions } from '../actions/action-zoomiso-actions.js'
import { ZoomConfig } from '../config.js'

export function GetPresetsZoomISOSelections(instance: InstanceBaseExt<ZoomConfig>): CompanionPresetDefinitionsExt {
	const presets: CompanionPresetDefinitionsExt = {}
	/**
	 * ZoomISO Selections
	 */
	presets[`Apply_Output`] = {
		type: 'button',
		category: 'ZoomISO Selections',
		name: `Apply_Output`,
		style: {
			text: `Apply Output`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdZoomISOActions.applyOutput,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`Apply_Outputs`] = {
		type: 'button',
		category: 'ZoomISO Selections',
		name: `Apply_Outputs`,
		style: {
			text: `Apply Outputs`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdZoomISOActions.applyOutputs,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`Apply_Channel`] = {
		type: 'button',
		category: 'ZoomISO Selections',
		name: `Apply_Channel`,
		style: {
			text: `Apply Channel`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdZoomISOActions.applyChannel,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	const outputDataLength = Object.keys(instance.ZoomOutputData).length
	for (let index = 1; index < (outputDataLength === 0 ? 9 : outputDataLength + 1); index++) {
		const outputName = instance.ZoomOutputData[index] ? instance.ZoomOutputData[index].outputName : `Output ${index}`

		presets[`Select_Output_${index}`] = {
			type: 'button',
			category: 'ZoomISO Selections',
			name: `select_output_${index}`,
			style: {
				text: `\`Select\n\${substr('${outputName}',0,45)}\``,
				size: '10',
				color: colorBlack,
				bgcolor: colorGreenOlive,
				textExpression: true,
			} as any,
			steps: [
				{
					down: [
						{
							actionId: ActionIdZoomISOActions.selectOutput,
							options: {
								output: index,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: FeedbackId.output,
					options: {
						output: index,
					},
					style: {
						color: colorBlack,
						bgcolor: colorRed,
					},
				},
			],
		}
	}
	const outputAudioDataLength = Object.keys(instance.ZoomAudioRoutingData).length
	// instance.log('info', `outputAudioData:  ${JSON.stringify(instance.ZoomAudioRoutingData)}`)
	for (let index = 1; index < (outputAudioDataLength === 0 ? 9 : outputAudioDataLength + 1); index++) {
		const outputAudioName = instance.ZoomAudioRoutingData[index]
			? `${instance.ZoomAudioRoutingData[index].channel}. ${instance.ZoomAudioRoutingData[index].audio_device} - ${instance.ZoomAudioRoutingData[index].mode}`
			: `Audio Channel ${index}`
		presets[`Select_Audio_Channel_${index}`] = {
			type: 'button',
			category: 'ZoomISO Selections',
			name: `Audio\nChannel${index}`,
			style: {
				text: `\`Select\n\${substr('${outputAudioName}',0,45)}\``,
				size: '10',
				color: colorBlack,
				bgcolor: colorGreenOlive,
				textExpression: true,
			} as any,
			steps: [
				{
					down: [
						{
							actionId: ActionIdZoomISOActions.selectAudioChannel,
							options: { output: index },
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: FeedbackId.audioOutput,
					options: {
						output: index,
					},
					style: {
						color: colorBlack,
						bgcolor: colorRed,
					},
				},
			],
		}
	}

	presets[`Select_Channel`] = {
		type: 'button',
		category: 'ZoomISO Selections',
		name: `Select_Channel`,
		style: {
			text: `Select Channel`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdZoomISOActions.selectAudioChannel,
						options: {
							output: 1,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	return presets
}
