import type ModuleInstance from '../index.js'
import type { CompanionActionDefinitions } from '@companion-module/base'
import { DEFAULT_FORWARD_HOST, DEFAULT_FORWARD_PORT, invalidTargetReason } from '../osc/forwarder.js'

export enum ActionIdOscForwarding {
	setOscForwarding = 'set_osc_forwarding',
	setOscForwardTarget = 'set_osc_forward_target',
}

export enum OscForwardingState {
	off = 0,
	on = 1,
	toggle = 2,
}

export type ActionsSchemaOscForwarding = {
	[ActionIdOscForwarding.setOscForwarding]: { options: { state: OscForwardingState } }
	[ActionIdOscForwarding.setOscForwardTarget]: { options: { host: string; port: string } }
}

/**
 * Turns OSC forwarding on or off and changes where it goes. Each change is saved, so it's remembered after a
 * restart, and applied to the forwarder alone: the connection to ZoomOSC/ISO and the groups are left as they are.
 */
export function GetActionsOscForwarding(
	instance: ModuleInstance,
): CompanionActionDefinitions<ActionsSchemaOscForwarding> {
	const actions: CompanionActionDefinitions<ActionsSchemaOscForwarding> = {
		[ActionIdOscForwarding.setOscForwarding]: {
			name: 'OSC Forwarding: On / Off / Toggle',
			description: 'Forward every OSC message received from ZoomOSC/ISO to the OSC forwarding IP and port',
			options: [
				{
					type: 'dropdown',
					label: 'OSC Forwarding',
					id: 'state',
					default: OscForwardingState.toggle,
					choices: [
						{ id: OscForwardingState.on, label: 'On' },
						{ id: OscForwardingState.off, label: 'Off' },
						{ id: OscForwardingState.toggle, label: 'Toggle' },
					],
				},
			],
			callback: (action): void => {
				const state = action.options.state
				instance.config.enableOscForwarding =
					state === OscForwardingState.toggle ? !instance.config.enableOscForwarding : state === OscForwardingState.on
				instance.saveConfig(instance.config)
				instance.OSC?.updateForwarding()
			},
		},
		[ActionIdOscForwarding.setOscForwardTarget]: {
			name: 'Set OSC Forwarding Target',
			description: 'Set the IP and port OSC forwarding sends to. When forwarding is on, it switches right away.',
			options: [
				{
					type: 'textinput',
					label: 'Forward to IP',
					id: 'host',
					default: DEFAULT_FORWARD_HOST,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Forward to port',
					id: 'port',
					default: String(DEFAULT_FORWARD_PORT),
					useVariables: true,
				},
			],
			callback: (action): void => {
				const target = { host: String(action.options.host).trim(), port: Number(String(action.options.port).trim()) }
				const problem = invalidTargetReason(target)
				if (problem) {
					instance.log('error', `Set OSC Forwarding Target: nothing changed, because ${problem}`)
					return
				}
				instance.config.oscForwardHost = target.host
				instance.config.oscForwardPort = target.port
				instance.saveConfig(instance.config)
				instance.OSC?.updateForwarding()
			},
		},
	}

	return actions
}
