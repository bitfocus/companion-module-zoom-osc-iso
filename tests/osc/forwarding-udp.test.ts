import { afterEach, describe, expect, it, vi } from 'vitest'
import { Message, encode } from 'node-osc'

// real UDP on localhost: proves the forwarding works through node:dgram, not only against the fake in tests/setup.ts
vi.unmock('node:dgram')
const { createSocket } = await import('node:dgram')
const { OSC } = await import('../../src/osc.js')
const { createMockInstance } = await import('../helpers/mock-instance.js')

type Socket = ReturnType<typeof createSocket>

async function bindLocal(): Promise<{ socket: Socket; port: number }> {
	const socket = createSocket('udp4')
	await new Promise<void>((resolve) => socket.bind(0, '127.0.0.1', resolve))
	return { socket, port: socket.address().port }
}

describe('OSC forwarding over real UDP', () => {
	const cleanup: Array<() => Promise<void> | void> = []

	afterEach(async () => {
		for (const step of cleanup.splice(0).reverse()) await step()
	})

	it('delivers the exact bytes ZoomISO sent to the forward target', async () => {
		// a free port for the module to receive on, then the forward target
		const probe = await bindLocal()
		const rxPort = probe.port
		await new Promise<void>((resolve) => probe.socket.close(() => resolve()))
		const target = await bindLocal()
		cleanup.push(async () => new Promise<void>((resolve) => target.socket.close(() => resolve())))
		const received = new Promise<Buffer>((resolve) => target.socket.once('message', (msg) => resolve(msg)))

		const instance = createMockInstance()
		Object.assign(instance.config, {
			host: '127.0.0.1',
			tx_port: 9090,
			rx_port: rxPort,
			enableOscForwarding: true,
			oscForwardHost: '127.0.0.1',
			oscForwardPort: target.port,
		})
		const osc = new OSC(instance)
		cleanup.push(async () => osc.destroy())
		await vi.waitFor(() => expect(instance.log).toHaveBeenCalledWith('info', `Listening to ZoomOSC on port: ${rxPort}`))

		// play ZoomISO: send a chat message to the module's receiving port
		const packet = encode(new Message('/zoomosc/user/chat', -1, 'Maria', 2, 16778240, 'Hello 👋', 'msg-1', 1))
		const zoom = createSocket('udp4')
		cleanup.push(async () => new Promise<void>((resolve) => zoom.close(() => resolve())))
		zoom.send(packet, rxPort, '127.0.0.1')

		const forwarded = await received
		expect(forwarded.equals(packet)).toBe(true)
	})
})
