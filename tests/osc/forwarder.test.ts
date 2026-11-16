import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ZoomConfig } from '../../src/config.js'
import {
	checkForwardTarget,
	forwardTargetFromConfig,
	invalidTargetReason,
	onlyForwardingSettingsChanged,
	OscForwarder,
} from '../../src/osc/forwarder.js'
import { createMockInstance } from '../helpers/mock-instance.js'

describe('forwardTargetFromConfig', () => {
	it('uses the saved IP and port', () => {
		expect(forwardTargetFromConfig({ oscForwardHost: '10.0.0.5', oscForwardPort: 8000 })).toEqual({
			host: '10.0.0.5',
			port: 8000,
		})
	})

	it('falls back to 127.0.0.1:1235 for a connection that has none saved', () => {
		expect(forwardTargetFromConfig({ oscForwardHost: '', oscForwardPort: 0 })).toEqual({
			host: '127.0.0.1',
			port: 1235,
		})
	})
})

describe('onlyForwardingSettingsChanged', () => {
	const config = (): ZoomConfig => structuredClone(createMockInstance().config)

	it('is true when only forwarding settings changed', () => {
		const next = { ...config(), enableOscForwarding: true, oscForwardHost: '10.0.0.5', oscForwardPort: 8000 }
		expect(onlyForwardingSettingsChanged(config(), next)).toBe(true)
	})

	it('is false when anything else changed too, or nothing changed at all', () => {
		expect(onlyForwardingSettingsChanged(config(), { ...config(), enableOscForwarding: true, host: '10.0.0.9' })).toBe(
			false,
		)
		expect(onlyForwardingSettingsChanged(config(), { ...config(), socialStreamChatTypeToSend: [1] })).toBe(false)
		expect(onlyForwardingSettingsChanged(config(), config())).toBe(false)
	})
})

describe('invalidTargetReason', () => {
	it('accepts an IP address and a port', () => {
		expect(invalidTargetReason({ host: '192.168.1.20', port: 1235 })).toBeNull()
	})

	it('refuses anything else', () => {
		expect(invalidTargetReason({ host: 'chat-pc', port: 1235 })).toBe('"chat-pc" is not an IP address')
		expect(invalidTargetReason({ host: '', port: 1235 })).toBe('"" is not an IP address')
		expect(invalidTargetReason({ host: '127.0.0.1', port: 0 })).toBe('"0" is not a port (1 to 65535)')
		expect(invalidTargetReason({ host: '127.0.0.1', port: 70000 })).toBe('"70000" is not a port (1 to 65535)')
		expect(invalidTargetReason({ host: '127.0.0.1', port: Number.NaN })).toBe('"NaN" is not a port (1 to 65535)')
	})
})

describe('checkForwardTarget', () => {
	it('accepts another application on this computer or another one', () => {
		expect(checkForwardTarget({ host: '127.0.0.1', port: 1235 }, 1234, '127.0.0.1', 9090)).toBeNull()
		expect(checkForwardTarget({ host: '10.0.0.5', port: 1234 }, 1234, '127.0.0.1', 9090)).toBeNull()
	})

	it("refuses this module's own receiving port, which would loop", () => {
		expect(checkForwardTarget({ host: '127.0.0.1', port: 1234 }, 1234, '127.0.0.1', 9090)).toBe(
			"127.0.0.1:1234 is this module's own receiving port, so the messages would loop",
		)
	})

	it("refuses ZoomOSC/ISO's receiving port", () => {
		expect(checkForwardTarget({ host: '10.0.0.5', port: 9090 }, 1234, '10.0.0.5', 9090)).toBe(
			"10.0.0.5:9090 is ZoomOSC/ISO's receiving port, so the messages would go back into ZoomOSC/ISO",
		)
		// ZoomOSC/ISO on this computer, reached through another of its addresses
		expect(checkForwardTarget({ host: '127.0.0.1', port: 9090 }, 1234, '127.0.0.2', 9090)).not.toBeNull()
	})

	it('refuses a target that is not an IP address and port', () => {
		expect(checkForwardTarget({ host: 'chat-pc', port: 1235 }, 1234, '127.0.0.1', 9090)).toBe(
			'"chat-pc" is not an IP address',
		)
	})
})

describe('OscForwarder', () => {
	const forwarders: OscForwarder[] = []
	afterEach(async () => {
		for (const forwarder of forwarders.splice(0)) await forwarder.close()
	})

	function create() {
		const log = vi.fn()
		const forwarder = new OscForwarder({ host: '127.0.0.1', port: 1235 }, log)
		forwarders.push(forwarder)
		const socket = (forwarder as unknown as { socket: { send: (...args: unknown[]) => void } }).socket
		return { forwarder, log, socket }
	}

	it('logs every failed send, as it happens', () => {
		const { forwarder, log, socket } = create()
		vi.spyOn(socket, 'send').mockImplementation((...args: unknown[]) => {
			const onSent = args[args.length - 1] as (error: Error | null) => void
			onSent(new Error('send EHOSTUNREACH 127.0.0.1:1235'))
		})

		forwarder.forward(new Uint8Array([1]))
		forwarder.forward(new Uint8Array([2]))

		expect(log.mock.calls).toEqual([
			['error', 'OSC forwarding to 127.0.0.1:1235 failed: send EHOSTUNREACH 127.0.0.1:1235'],
			['error', 'OSC forwarding to 127.0.0.1:1235 failed: send EHOSTUNREACH 127.0.0.1:1235'],
		])
	})

	it('logs a send that throws instead of letting it stop the module', () => {
		const { forwarder, log, socket } = create()
		vi.spyOn(socket, 'send').mockImplementation(() => {
			throw new Error('Not running')
		})

		expect(() => forwarder.forward(new Uint8Array([1]))).not.toThrow()
		expect(log).toHaveBeenCalledWith('error', 'OSC forwarding to 127.0.0.1:1235 failed: Not running')
	})

	it('sends nothing after it was closed', async () => {
		const { forwarder, socket } = create()
		const send = vi.spyOn(socket, 'send')
		await forwarder.close()

		forwarder.forward(new Uint8Array([1]))
		expect(send).not.toHaveBeenCalled()
	})
})
