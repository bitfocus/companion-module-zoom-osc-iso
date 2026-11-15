import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { EventEmitter } from 'node:events'
import { createSocket } from 'node:dgram'
import { Bundle, Message, encode } from 'node-osc'
import { OSC } from '../../src/osc.js'
import { checkForwardTarget } from '../../src/osc/forwarder.js'
import { createMockInstance, type MockModuleInstance } from '../helpers/mock-instance.js'

// node:dgram is mocked in tests/setup.ts: each socket is an EventEmitter with bind/send/close spies
type FakeSocket = EventEmitter & { bind: Mock; send: Mock; close: Mock }
const createSocketMock = createSocket as unknown as Mock

const pong = () => encode(new Message('/zoomosc/pong', 'ZISO 3.0', 'ZISO 3.0', 2, 1, 1, 0, 5, 1))
const flush = async () => new Promise((resolve) => setTimeout(resolve, 0))

function start(config: Partial<MockModuleInstance['config']>): {
	instance: MockModuleInstance
	osc: OSC
	server: FakeSocket
	forwarder: FakeSocket | undefined
} {
	createSocketMock.mockClear()
	const instance = createMockInstance()
	Object.assign(instance.config, { host: '127.0.0.1', tx_port: 9090, rx_port: 1234 }, config)
	const osc = new OSC(instance)
	const sockets = createSocketMock.mock.results.map((r) => r.value as FakeSocket)
	// the receiving socket is the one that gets bound; the forwarder only sends
	const server = sockets.find((s) => s.bind.mock.calls.length > 0)!
	const forwarder = sockets.find((s) => s !== server)
	return { instance, osc, server, forwarder }
}

describe('OSC forwarding', () => {
	let osc: OSC | undefined

	afterEach(async () => {
		vi.useRealTimers()
		await osc?.destroy()
		osc = undefined
	})

	it('listens on the receiving port and forwards nothing when forwarding is off', () => {
		const started = start({ enableOscForwarding: false })
		osc = started.osc
		expect(started.server.bind).toHaveBeenCalledWith(1234, '0.0.0.0')
		expect(started.forwarder).toBeUndefined()
	})

	it('sends each packet to the target byte for byte, and still handles it itself', async () => {
		const started = start({ enableOscForwarding: true, oscForwardHost: '127.0.0.1', oscForwardPort: 1235 })
		osc = started.osc
		const packet = pong()

		started.server.emit('message', packet, { address: '127.0.0.1', port: 9090 })
		await flush()

		expect(started.forwarder!.send).toHaveBeenCalledTimes(1)
		const [sent, port, host] = started.forwarder!.send.mock.calls[0]
		expect(sent).toBe(packet)
		expect([port, host]).toEqual([1235, '127.0.0.1'])
		// the module processed the pong as usual
		expect(started.instance.ZoomClientDataObj.zoomOSCVersion).toBe('ZISO 3.0')
		expect(started.instance.ZoomClientDataObj.callStatus).toBe(1)
	})

	it('forwards a packet it cannot decode, and a bundle, without handling either', async () => {
		const started = start({ enableOscForwarding: true, oscForwardHost: '127.0.0.1', oscForwardPort: 1235 })
		osc = started.osc
		const garbage = Buffer.from('not an OSC packet')
		const bundle = encode(new Bundle(['/zoomosc/pong', 'ZISO 3.0', 'ZISO 3.0', 2, 1, 1, 0, 5, 1]))

		started.server.emit('message', garbage, { address: '127.0.0.1', port: 9090 })
		started.server.emit('message', bundle, { address: '127.0.0.1', port: 9090 })
		await flush()

		expect(started.forwarder!.send.mock.calls.map((call) => call[0])).toEqual([garbage, bundle])
		expect(started.instance.ZoomClientDataObj.zoomOSCVersion).not.toBe('ZISO 3.0')
		expect(started.instance.log).not.toHaveBeenCalledWith('error', expect.anything())
	})

	it('uses the default target when the connection has no forward IP or port saved', () => {
		const started = start({
			enableOscForwarding: true,
			oscForwardHost: undefined as unknown as string,
			oscForwardPort: undefined as unknown as number,
		})
		osc = started.osc
		started.server.emit('message', pong(), {})
		expect(started.forwarder!.send.mock.calls[0].slice(1, 3)).toEqual([1235, '127.0.0.1'])
	})

	it("refuses a target that is this module's own receiving port", () => {
		const started = start({ enableOscForwarding: true, oscForwardHost: '127.0.0.1', oscForwardPort: 1234 })
		osc = started.osc
		expect(started.forwarder).toBeUndefined()
		expect(started.instance.log).toHaveBeenCalledWith('warn', expect.stringContaining('OSC forwarding is off'))
	})

	it("refuses a target that is ZoomOSC/ZoomISO's receiving port", () => {
		const started = start({ enableOscForwarding: true, oscForwardHost: '127.0.0.1', oscForwardPort: 9090 })
		osc = started.osc
		expect(started.forwarder).toBeUndefined()
		expect(started.instance.log).toHaveBeenCalledWith('warn', expect.stringContaining('receiving port'))
	})

	it('logs a failed send at most once a minute and keeps forwarding', () => {
		vi.useFakeTimers()
		const started = start({ enableOscForwarding: true, oscForwardHost: '127.0.0.1', oscForwardPort: 1235 })
		osc = started.osc
		started.forwarder!.send.mockImplementation((...args: unknown[]) => {
			;(args[3] as (e: Error) => void)(new Error('send failed'))
		})
		const failures = () =>
			vi.mocked(started.instance.log).mock.calls.filter((call) => String(call[1]).includes('OSC forwarding to')).length

		started.server.emit('message', pong(), {})
		started.server.emit('message', pong(), {})
		expect(failures()).toBe(1)

		vi.advanceTimersByTime(61_000)
		started.server.emit('message', pong(), {})
		expect(failures()).toBe(2)
		expect(started.forwarder!.send).toHaveBeenCalledTimes(3)
	})

	it('closes the forwarding socket on destroy and forwards nothing afterwards', async () => {
		const started = start({ enableOscForwarding: true, oscForwardHost: '127.0.0.1', oscForwardPort: 1235 })
		await started.osc.destroy()
		expect(started.forwarder!.close).toHaveBeenCalled()
		expect(started.server.close).toHaveBeenCalled()
		started.server.emit('message', pong(), {})
		expect(started.forwarder!.send).not.toHaveBeenCalled()
	})
})

describe('checkForwardTarget', () => {
	beforeEach(() => createSocketMock.mockClear())

	it('accepts another port on this computer, or the same port on another computer', () => {
		expect(checkForwardTarget({ host: '127.0.0.1', port: 1235 }, 1234, '127.0.0.1', 9090)).toBeNull()
		expect(checkForwardTarget({ host: '192.0.2.10', port: 1234 }, 1234, '127.0.0.1', 9090)).toBeNull()
	})

	it('refuses this module receiving port on any local address', () => {
		for (const host of ['127.0.0.1', '0.0.0.0', 'localhost']) {
			expect(checkForwardTarget({ host, port: 1234 }, 1234, '127.0.0.1', 9090)).toContain('loop')
		}
	})

	it('refuses the ZoomOSC/ZoomISO receiving port, on its host or when both are local', () => {
		expect(checkForwardTarget({ host: '192.0.2.20', port: 9090 }, 1234, '192.0.2.20', 9090)).toContain(
			'back into ZoomOSC/ZoomISO',
		)
		expect(checkForwardTarget({ host: '0.0.0.0', port: 9090 }, 1234, '127.0.0.1', 9090)).toContain(
			'back into ZoomOSC/ZoomISO',
		)
	})

	it('refuses a missing IP or an invalid port', () => {
		expect(checkForwardTarget({ host: '', port: 1235 }, 1234, '127.0.0.1', 9090)).toContain('no IP address')
		expect(checkForwardTarget({ host: '127.0.0.1', port: 0 }, 1234, '127.0.0.1', 9090)).toContain('not a valid port')
		expect(checkForwardTarget({ host: '127.0.0.1', port: 70000 }, 1234, '127.0.0.1', 9090)).toContain(
			'not a valid port',
		)
	})
})
