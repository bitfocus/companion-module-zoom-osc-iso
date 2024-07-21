import { ActionIdZoomISORouting } from '../actions/action-zoomiso-routing.js'
import { colorBlack, colorGreenOlive, InstanceBaseExt } from '../utils.js'
import { CompanionPresetDefinitionsExt } from './preset-utils.js'
import { ActionIdZoomISOEngine } from '../actions/action-zoomiso-engine.js'
import { ActionIdZoomISOOutputSettings } from '../actions/action-zoomiso-output-settings.js'
import { ZoomConfig } from '../config.js'

export function GetPresetsZoomISOActions(instance: InstanceBaseExt<ZoomConfig>): CompanionPresetDefinitionsExt {
	const presets: CompanionPresetDefinitionsExt = {}

	/**
	 * ZoomISO Actions
	 */
	const outputDataLength = Object.keys(instance.ZoomOutputData).length
	for (let index = 1; index < (outputDataLength === 0 ? 9 : outputDataLength + 1); index++) {
		const outputName = instance.ZoomOutputData[index] ? instance.ZoomOutputData[index].outputName : index
		presets[`set_user_to_output_${index}`] = {
			type: 'button',
			category: 'ZoomISO Actions',
			name: `set_user_to_output_${index}`,
			style: {
				text: `SetUser to\n${outputName}`,
				size: '10',
				color: colorBlack,
				bgcolor: colorGreenOlive,
			} as any,
			steps: [
				{
					down: [
						{
							actionId: ActionIdZoomISORouting.outputISO,
							options: {
								userName: '',
								output: index,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	}

	presets[`add_Output`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `add_Output`,
		style: {
			text: `Add Output`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdZoomISOOutputSettings.addOutput,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`delete_Output`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `delete_Output`,
		style: {
			text: `Delete Output`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdZoomISOOutputSettings.deleteOutput,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`disable_Output`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `disable_Output`,
		style: {
			text: `Disable Output`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdZoomISOOutputSettings.disableOutput,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`enable_Output`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `enable_Output`,
		style: {
			text: `Enable Output`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdZoomISOOutputSettings.enableOutput,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`set_output_count`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_output_count`,
		style: {
			text: `set Output Count`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdZoomISOOutputSettings.setOutputCount,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`set_output_name`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_output_name`,
		style: {
			text: `Set Output Name`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdZoomISOOutputSettings.setOutputName,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`set_output_mode`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_output_mode`,
		style: {
			text: `Set Output Mode`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdZoomISOOutputSettings.setOutputMode,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`standby_iso_engine`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `standby_iso_engine`,
		style: {
			text: `Standby ISO Engine`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdZoomISOEngine.standbyISOEngine,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`start_iso_engine`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `start_iso_engine`,
		style: {
			text: `Start ISO Engine`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdZoomISOEngine.startISOEngine,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`stop_iso_engine`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `stop_iso_engine`,
		style: {
			text: `Stop ISO Engine`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdZoomISOEngine.stopISOEngine,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`set_video_loss_mode`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_video_loss_mode`,
		style: {
			text: `Set Video Loss Mode`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdZoomISOOutputSettings.setVideoLossMode,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`set_user_to_audio_channel`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_user_to_audio_channel`,
		style: {
			text: `Set User to Audio Channel`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdZoomISORouting.audioISO,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`set_audio_mode`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_audio_mode`,
		style: {
			text: `Set Audio Mode`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionIdZoomISOOutputSettings.setAudioMode,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	return presets
}
