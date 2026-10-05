import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type { ModuleSchema } from '../index.js'
import type ModuleInstance from '../index.js'
import { ActionIdZoomISORouting } from '../actions/action-zoomiso-routing.js'
import { colorBlack, colorGreenOlive } from '../utils.js'
import { ActionIdZoomISOEngine } from '../actions/action-zoomiso-engine.js'
import { ActionIdZoomISOOutputSettings } from '../actions/action-zoomiso-output-settings.js'

export enum PresetIdZoomISOActions {
	addOutput = 'add_Output',
	deleteOutput = 'delete_Output',
	disableOutput = 'disable_Output',
	enableOutput = 'enable_Output',
	setOutputCount = 'set_output_count',
	setOutputName = 'set_output_name',
	setOutputMode = 'set_output_mode',
	standbyIsoEngine = 'standby_iso_engine',
	startIsoEngine = 'start_iso_engine',
	stopIsoEngine = 'stop_iso_engine',
	setVideoLossMode = 'set_video_loss_mode',
	setUserToAudioChannel = 'set_user_to_audio_channel',
	setAudioMode = 'set_audio_mode',
}

export function GetPresetsZoomISOActions(instance: ModuleInstance): {
	section: CompanionPresetSection<ModuleSchema>
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	const presets: CompanionPresetDefinitions<ModuleSchema> &
		Record<PresetIdZoomISOActions, CompanionPresetDefinitions<ModuleSchema>[string]> = {
		[PresetIdZoomISOActions.addOutput]: {
			type: 'simple',
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
		},
		[PresetIdZoomISOActions.deleteOutput]: {
			type: 'simple',
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
							options: { output: 1 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdZoomISOActions.disableOutput]: {
			type: 'simple',
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
							options: { output: 1 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdZoomISOActions.enableOutput]: {
			type: 'simple',
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
							options: { output: 1 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdZoomISOActions.setOutputCount]: {
			type: 'simple',
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
							options: { count: 1 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdZoomISOActions.setOutputName]: {
			type: 'simple',
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
							options: { output: 1, name: '' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdZoomISOActions.setOutputMode]: {
			type: 'simple',
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
							options: { output: 1, outputMode: 'Spotlight' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdZoomISOActions.standbyIsoEngine]: {
			type: 'simple',
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
		},
		[PresetIdZoomISOActions.startIsoEngine]: {
			type: 'simple',
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
		},
		[PresetIdZoomISOActions.stopIsoEngine]: {
			type: 'simple',
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
		},
		[PresetIdZoomISOActions.setVideoLossMode]: {
			type: 'simple',
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
							options: { videoLossMode: 'Black' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdZoomISOActions.setUserToAudioChannel]: {
			type: 'simple',
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
							options: { userName: '', output: 1 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		[PresetIdZoomISOActions.setAudioMode]: {
			type: 'simple',
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
							options: { number: 1, audioChannelMode: 'Off' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
	}

	/**
	 * ZoomISO Actions — dynamic per-output entries
	 */
	const dynamicIds: string[] = []
	const outputDataLength = Object.keys(instance.ZoomOutputData).length
	for (let index = 1; index < (outputDataLength === 0 ? 9 : outputDataLength + 1); index++) {
		const outputName = instance.ZoomOutputData[index] ? instance.ZoomOutputData[index].outputName : index
		const id = `set_user_to_output_${index}`
		dynamicIds.push(id)
		presets[id] = {
			type: 'simple',
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
								setToNoneIfNotUserSelected: false,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	}

	const section: CompanionPresetSection<ModuleSchema> = {
		id: 'zoomiso_actions',
		name: 'ZoomISO Actions',
		definitions: [...Object.values(PresetIdZoomISOActions), ...dynamicIds],
	}

	return { section, presets }
}
