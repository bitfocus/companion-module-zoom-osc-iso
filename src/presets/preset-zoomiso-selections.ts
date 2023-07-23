import { FeedbackId } from '../feedback'
import { ZoomAudioRoutingDataInterface, colorBlack, colorGreenOlive, colorRed } from '../utils'
import { CompanionPresetDefinitionsExt } from './preset-utils'
import { ActionIdZoomISOActions } from '../actions/action-zoomiso-actions'

export function GetPresetsZoomISOSelections(
	ZoomAudioRoutingData: ZoomAudioRoutingDataInterface
): CompanionPresetDefinitionsExt {
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
	for (
		let index = 1;
		index < (Object.keys(ZoomAudioRoutingData).length === 0 ? 9 : Object.keys(ZoomAudioRoutingData).length + 1);
		index++
	) {
		presets[`Select_Output_${index}`] = {
			type: 'button',
			category: 'ZoomISO Selections',
			name: `Select Output ${index}`,
			style: {
				text: `Select Output ${index}`,
				size: '14',
				color: colorBlack,
				bgcolor: colorGreenOlive,
			},
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
	for (let index = 1; index < 9; index++) {
		presets[`Select_Audio_Channel ${index}`] = {
			type: 'button',
			category: 'ZoomISO Selections',
			name: `Audio\nChannel ${index}`,
			style: {
				text: `Audio\nChannel ${index}`,
				size: '14',
				color: colorBlack,
				bgcolor: colorGreenOlive,
			},
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
