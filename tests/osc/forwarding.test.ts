import { afterEach, beforeEach, describe, expect, it, type Mock } from 'vitest'
import type { EventEmitter } from 'node:events'
import { createSocket, type Socket } from 'node:dgram'
import osc from 'osc'
import { OSC } from '../../src/osc.js'
import { createMockInstance, type MockModuleInstance } from '../helpers/mock-instance.js'

// osc is mocked in tests/setup.ts: the fake port stands in for ZoomOSC/ISO's side, while forwarding sends for real
type FakePort = EventEmitter & { send: Mock; close: Mock }
const ports = (osc.UDPPort as unknown as { instances: FakePort[] }).instances
const lastPort = () => ports[ports.length - 1]

/** A real UDP socket playing the application that OSC is forwarded to */
async function listen(): Promise<{ socket: Socket; port: number; received: Buffer[] }> {
	const socket = createSocket('udp4')
	const received: Buffer[] = []
	socket.on('message', (packet) => received.push(packet))
	await new Promise<void>((resolve) => socket.bind(0, '127.0.0.1', resolve))
	return { socket, port: socket.address().port, received }
}

const wait = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('OSC forwarding', () => {
	const cleanup: Array<() => Promise<void> | void> = []
	beforeEach(() => {
		ports.length = 0
	})
	afterEach(async () => {
		for (const step of cleanup.splice(0).reverse()) await step()
	})

	function connect(forwarding: Partial<MockModuleInstance['config']>): {
		instance: MockModuleInstance
		connection: OSC
	} {
		const instance = createMockInstance()
		Object.assign(instance.config, { rx_port: 1234, host: '127.0.0.1', tx_port: 9090 }, forwarding)
		const connection = new OSC(instance)
		cleanup.push(async () => connection.destroy())
		return { instance, connection }
	}

	it('forwards nothing while it is off', async () => {
		const target = await listen()
		cleanup.push(() => void target.socket.close())
		const { instance, connection } = connect({ enableOscForwarding: false, oscForwardPort: target.port })

		lastPort().emit('raw', new Uint8Array([1, 2, 3]), { address: '127.0.0.1', port: 9090 })
		await wait(50)

		expect(target.received).toEqual([])
		expect(connection.isForwarding()).toBe(false)
		expect(instance.log).not.toHaveBeenCalledWith('info', expect.stringContaining('Forwarding all OSC'))
	})

	it('forwards every packet from ZoomOSC/ISO byte for byte, whoever sent it', async () => {
		const target = await listen()
		cleanup.push(() => void target.socket.close())
		const { instance, connection } = connect({
			enableOscForwarding: true,
			oscForwardHost: '127.0.0.1',
			oscForwardPort: target.port,
		})
		expect(connection.isForwarding()).toBe(true)
		expect(instance.log).toHaveBeenCalledWith('info', `Forwarding all OSC from ZoomOSC/ISO to 127.0.0.1:${target.port}`)

		lastPort().emit('raw', Buffer.from('/zoomosc/one\0\0\0\0,\0\0\0'), { address: '127.0.0.1', port: 9090 })
		lastPort().emit('raw', Buffer.from('/zoomosc/two\0\0\0\0,\0\0\0'), { address: '192.168.1.50', port: 50000 })

		await expect.poll(() => target.received.length).toBe(2)
		expect(target.received.map(String)).toEqual(['/zoomosc/one\0\0\0\0,\0\0\0', '/zoomosc/two\0\0\0\0,\0\0\0'])
	})

	it('shows the target in the variables and re-checks the feedback when forwarding changes', () => {
		const { instance, connection } = connect({
			enableOscForwarding: true,
			oscForwardHost: '127.0.0.1',
			oscForwardPort: 5000,
		})
		expect(instance.setVariableValues).toHaveBeenLastCalledWith({ oscForwardHost: '127.0.0.1', oscForwardPort: 5000 })
		expect(instance.checkFeedbacks).toHaveBeenLastCalledWith('osc_forwarding')

		instance.config.enableOscForwarding = false
		connection.updateForwarding()
		expect(connection.isForwarding()).toBe(false)
		expect(instance.log).toHaveBeenLastCalledWith('info', 'OSC forwarding is off')
		expect(instance.setVariableValues).toHaveBeenLastCalledWith({ oscForwardHost: '127.0.0.1', oscForwardPort: 5000 })
		expect(instance.checkFeedbacks).toHaveBeenLastCalledWith('osc_forwarding')
	})

	it('switches to a new target without reopening or closing the connection to ZoomOSC/ISO', async () => {
		const first = await listen()
		const second = await listen()
		cleanup.push(() => void first.socket.close())
		cleanup.push(() => void second.socket.close())
		const { instance, connection } = connect({
			enableOscForwarding: true,
			oscForwardHost: '127.0.0.1',
			oscForwardPort: first.port,
		})
		const zoomPort = lastPort()

		instance.config.oscForwardPort = second.port
		connection.updateForwarding()
		zoomPort.emit('raw', Buffer.from('/zoomosc/x\0\0,\0\0\0'), { address: '127.0.0.1', port: 9090 })

		await expect.poll(() => second.received.length).toBe(1)
		expect(first.received).toEqual([])
		expect(ports).toHaveLength(1)
		expect(zoomPort.close).not.toHaveBeenCalled()
	})

	it('refuses a target that would loop, logs why, and leaves forwarding off', () => {
		const { instance, connection } = connect({
			enableOscForwarding: true,
			oscForwardHost: '127.0.0.1',
			oscForwardPort: 1234,
		})

		expect(connection.isForwarding()).toBe(false)
		expect(instance.log).toHaveBeenCalledWith(
			'error',
			"OSC forwarding can't start: 127.0.0.1:1234 is this module's own receiving port, so the messages would loop",
		)
	})

	it('stops forwarding when the connection stops', async () => {
		const { connection } = connect({ enableOscForwarding: true, oscForwardHost: '127.0.0.1', oscForwardPort: 5000 })
		const stopped = connection.destroy()
		lastPort().emit('close')
		await stopped

		expect(connection.isForwarding()).toBe(false)
		// a forwarding action after the stop starts nothing
		connection.updateForwarding()
		expect(connection.isForwarding()).toBe(false)
	})
})
