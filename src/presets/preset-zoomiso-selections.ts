import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type { ModuleSchema } from '../index.js'
import type ModuleInstance from '../index.js'
import { FeedbackId } from '../feedback.js'
import { colorBlack, colorGreenOlive, colorRed } from '../utils.js'
import { ActionIdZoomISOActions } from '../actions/action-zoomiso-actions.js'

export enum PresetIdZoomISOSelections {
	applyOutput = 'Apply_Output',
	applyOutputs = 'Apply_Outputs',
	applyChannel = 'Apply_Channel',
	selectChannel = 'Select_Channel',
}

export function GetPresetsZoomISOSelections(instance: ModuleInstance): {
	section: CompanionPresetSection<ModuleSchema>
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	/**
	 * ZoomISO Selections
	 */
	const presets: CompanionPresetDefinitions<ModuleSchema> &
		Record<PresetIdZoomISOSelections, CompanionPresetDefinitions<ModuleSchema>[string]> = {
		[PresetIdZoomISOSelections.applyOutput]: {
			type: 'simple',
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
		},
		[PresetIdZoomISOSelections.applyOutputs]: {
			type: 'simple',
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
		},
		[PresetIdZoomISOSelections.applyChannel]: {
			type: 'simple',
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
		},
		[PresetIdZoomISOSelections.selectChannel]: {
			type: 'simple',
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
		},
	}

	const dynamicPresets: CompanionPresetDefinitions<ModuleSchema> = presets
	const dynamicIds: string[] = []

	const outputDataLength = Object.keys(instance.ZoomOutputData).length
	for (let index = 1; index < (outputDataLength === 0 ? 9 : outputDataLength + 1); index++) {
		const outputName = instance.ZoomOutputData[index] ? instance.ZoomOutputData[index].outputName : `Output ${index}`

		dynamicIds.push(`Select_Output_${index}`)
		dynamicPresets[`Select_Output_${index}`] = {
			type: 'simple',
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
		dynamicIds.push(`Select_Audio_Channel_${index}`)
		dynamicPresets[`Select_Audio_Channel_${index}`] = {
			type: 'simple',
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

	const section: CompanionPresetSection<ModuleSchema> = {
		id: 'zoomiso_selections',
		name: 'ZoomISO Selections',
		definitions: [...Object.values(PresetIdZoomISOSelections), ...dynamicIds],
	}

	return { section, presets }
}
