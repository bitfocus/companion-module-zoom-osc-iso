import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { createMockInstance, type MockModuleInstance } from '../helpers/mock-instance.js'
import {
	ActionIdOscForwarding,
	GetActionsOscForwarding,
	OscForwardingState,
} from '../../src/actions/action-osc-forwarding.js'
import { GetFeedbacks } from '../../src/feedback.js'

describe('OSC forwarding actions', () => {
	let instance: MockModuleInstance & { OSC: { updateForwarding: Mock; isForwarding: Mock } }
	let actions: ReturnType<typeof GetActionsOscForwarding>

	beforeEach(() => {
		instance = createMockInstance() as typeof instance
		Object.assign(instance.OSC, { updateForwarding: vi.fn(), isForwarding: vi.fn(() => false) })
		actions = GetActionsOscForwarding(instance)
	})

	const setForwarding = async (state: OscForwardingState) =>
		(actions[ActionIdOscForwarding.setOscForwarding] as any).callback({ options: { state } }, {})
	const setTarget = async (host: string, port: string) =>
		(actions[ActionIdOscForwarding.setOscForwardTarget] as any).callback({ options: { host, port } }, {})

	it('turns forwarding on, off and toggles it, saving each change and applying it to the forwarder', async () => {
		await setForwarding(OscForwardingState.on)
		expect(instance.config.enableOscForwarding).toBe(true)
		await setForwarding(OscForwardingState.toggle)
		expect(instance.config.enableOscForwarding).toBe(false)
		await setForwarding(OscForwardingState.toggle)
		expect(instance.config.enableOscForwarding).toBe(true)
		await setForwarding(OscForwardingState.off)
		expect(instance.config.enableOscForwarding).toBe(false)

		expect(instance.saveConfig).toHaveBeenCalledTimes(4)
		expect(instance.saveConfig).toHaveBeenLastCalledWith(instance.config)
		expect(instance.OSC.updateForwarding).toHaveBeenCalledTimes(4)
	})

	it('sets the target, saving it and applying it to the forwarder', async () => {
		await setTarget(' 192.168.1.20 ', ' 8000 ')

		expect(instance.config.oscForwardHost).toBe('192.168.1.20')
		expect(instance.config.oscForwardPort).toBe(8000)
		expect(instance.saveConfig).toHaveBeenCalledWith(instance.config)
		expect(instance.OSC.updateForwarding).toHaveBeenCalledTimes(1)
	})

	it('changes nothing and logs why when the IP or port is not valid', async () => {
		await setTarget('chat-pc', '8000')
		await setTarget('192.168.1.20', '')
		await setTarget('192.168.1.20', '99999')

		expect(instance.config.oscForwardHost).toBe('127.0.0.1')
		expect(instance.config.oscForwardPort).toBe(1235)
		expect(instance.saveConfig).not.toHaveBeenCalled()
		expect(instance.OSC.updateForwarding).not.toHaveBeenCalled()
		expect(vi.mocked(instance.log).mock.calls).toEqual([
			['error', 'Set OSC Forwarding Target: nothing changed, because "chat-pc" is not an IP address'],
			['error', 'Set OSC Forwarding Target: nothing changed, because "0" is not a port (1 to 65535)'],
			['error', 'Set OSC Forwarding Target: nothing changed, because "99999" is not a port (1 to 65535)'],
		])
	})

	it('lights the OSC Forwarding On feedback only while forwarding is running', () => {
		const feedback = GetFeedbacks(instance).osc_forwarding as any
		expect(feedback.callback({ options: {} })).toBe(false)
		instance.OSC.isForwarding.mockReturnValue(true)
		expect(feedback.callback({ options: {} })).toBe(true)
	})
})
