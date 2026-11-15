import type {
	CompanionButtonStepActions,
	CompanionPresetDefinitions,
	CompanionPresetSection,
} from '@companion-module/base'
import type { ModuleSchema } from '../index.js'
import { ActionIdOscForwarding, OscForwardingState } from '../actions/action-osc-forwarding.js'
import { FeedbackId } from '../feedback.js'
import { DEFAULT_FORWARD_HOST, DEFAULT_FORWARD_PORT } from '../osc/forwarder.js'
import { colorBlack, colorGreenOlive, colorLightGray } from '../utils.js'

export enum PresetIdOscForwarding {
	toggle = 'OSC_Forwarding_Toggle',
	on = 'OSC_Forwarding_On',
	off = 'OSC_Forwarding_Off',
	setTarget = 'OSC_Forwarding_Set_Target',
}

/** Lit while OSC forwarding is running */
const forwardingOn = {
	feedbackId: FeedbackId.oscForwarding,
	options: {},
	style: { color: colorBlack, bgcolor: colorGreenOlive },
} as const

export function GetPresetsOscForwarding(): {
	section: CompanionPresetSection<ModuleSchema>
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	const setForwarding = (state: OscForwardingState): CompanionButtonStepActions<ModuleSchema>[] => [
		{
			down: [{ actionId: ActionIdOscForwarding.setOscForwarding, options: { state } }],
			up: [],
		},
	]

	const presets: { [id in PresetIdOscForwarding]: CompanionPresetDefinitions<ModuleSchema>[string] } = {
		[PresetIdOscForwarding.toggle]: {
			type: 'simple',
			name: 'Forward OSC (toggle)',
			style: {
				text: 'FWD OSC\\n$(zoomosc:oscForwardHost)\\n$(zoomosc:oscForwardPort)',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: setForwarding(OscForwardingState.toggle),
			feedbacks: [forwardingOn],
		},
		[PresetIdOscForwarding.on]: {
			type: 'simple',
			name: 'Forward OSC On',
			style: {
				text: 'FWD OSC\\nON',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: setForwarding(OscForwardingState.on),
			feedbacks: [forwardingOn],
		},
		[PresetIdOscForwarding.off]: {
			type: 'simple',
			name: 'Forward OSC Off',
			style: {
				text: 'FWD OSC\\nOFF',
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: setForwarding(OscForwardingState.off),
			feedbacks: [forwardingOn],
		},
		[PresetIdOscForwarding.setTarget]: {
			type: 'simple',
			name: 'Set Forward OSC Target',
			style: {
				text: `FWD OSC TO\\n${DEFAULT_FORWARD_HOST}\\n${DEFAULT_FORWARD_PORT}`,
				size: '14',
				color: colorBlack,
				bgcolor: colorLightGray,
			},
			steps: [
				{
					down: [
						{
							actionId: ActionIdOscForwarding.setOscForwardTarget,
							options: { host: DEFAULT_FORWARD_HOST, port: String(DEFAULT_FORWARD_PORT) },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
	}

	const section: CompanionPresetSection<ModuleSchema> = {
		id: 'oscForwarding',
		name: 'Forward OSC Messages',
		definitions: Object.values(PresetIdOscForwarding),
	}

	return { section, presets }
}
