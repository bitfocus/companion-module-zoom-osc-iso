import { ActionId } from '../actions'
import { colorBlack, colorGreenOlive } from '../utils'
import { CompanionPresetDefinitionsExt } from './preset-utils'

export function GetPresetsZoomISOActions(): CompanionPresetDefinitionsExt {
	const presets: CompanionPresetDefinitionsExt = {}

	/**
	 * ZoomISO Actions
	 */
	presets[`set_user_to_output`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_user_to_output`,
		style: {
			text: `Set User to Output`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.outputISO,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
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
						actionId: ActionId.addOutput,
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
						actionId: ActionId.deleteOutput,
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
						actionId: ActionId.disableOutput,
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
						actionId: ActionId.enableOutput,
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
						actionId: ActionId.setOutputCount,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`set_output_embedded_audio`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_output_embedded_audio`,
		style: {
			text: `Set Output Embedded Audio`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.setOutputEmbeddedAudio,
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
						actionId: ActionId.setOutputName,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`set_output_selection`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_output_selection`,
		style: {
			text: `Set Output Selection`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.setOutputSelection,
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
						actionId: ActionId.setOutputMode,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`set_output_type`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_output_type`,
		style: {
			text: `Set Output Type`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.setOutputType,
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
						actionId: ActionId.standbyISOEngine,
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
						actionId: ActionId.startISOEngine,
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
						actionId: ActionId.stopISOEngine,
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
						actionId: ActionId.setVideoLossMode,
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
						actionId: ActionId.audioISO,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`set_audio_gain_reduction`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_audio_gain_reduction`,
		style: {
			text: `Set Audio Gain Reduction`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.setAudioGainReduction,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`set_audio_selection`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_audio_selection`,
		style: {
			text: `Set Audio Selection`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.setAudioSelection,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`set_output_embedded_audio`] = {
		type: 'button',
		category: 'ZoomISO Actions',
		name: `set_output_embedded_audio`,
		style: {
			text: `Set Output Embedded Audio`,
			size: '14',
			color: colorBlack,
			bgcolor: colorGreenOlive,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.setOutputEmbeddedAudio,
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
						actionId: ActionId.setAudioMode,
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
