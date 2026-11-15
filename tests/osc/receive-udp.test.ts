import { afterEach, describe, expect, it, vi } from 'vitest'

// real osc over real UDP on localhost: proves bundles, 32-bit and 64-bit Zoom IDs and argument types reach the
// handlers the way ZoomOSC/ISO sends them, not only the way the fake in tests/setup.ts behaves. node-osc silently
// rejected every packet with a 64-bit integer, and lost the difference between 1 and 1.0.
vi.unmock('osc')
const { default: osc } = await import('osc')
const { createSocket } = await import('node:dgram')
const { OSC } = await import('../../src/osc.js')
const { createOscPort, toZoomOSCResponse } = await import('../../src/osc/transport.js')
const { createMockInstance } = await import('../helpers/mock-instance.js')

type OscPacket = Parameters<InstanceType<typeof osc.UDPPort>['send']>[0]
type Message = Parameters<typeof toZoomOSCResponse>[0]
const i = (value: number) => ({ type: 'i', value })
const s = (value: string) => ({ type: 's', value })
const online = (zoomId: number, name: string) => ({
	address: '/zoomosc/user/online',
	args: [i(0), s(name), i(1), i(zoomId)],
})

async function freePort(): Promise<number> {
	const probe = createSocket('udp4')
	await new Promise<void>((resolve) => probe.bind(0, '127.0.0.1', resolve))
	const port = probe.address().port
	await new Promise<void>((resolve) => probe.close(() => resolve()))
	return port
}

describe('talking to ZoomOSC/ISO over real UDP', () => {
	const cleanup: Array<() => Promise<void> | void> = []

	afterEach(async () => {
		for (const step of cleanup.splice(0).reverse()) await step()
	})

	/** The module's connection, and a real osc port playing ZoomOSC/ISO, wired to each other */
	async function connect() {
		const [rxPort, zoomPort] = [await freePort(), await freePort()]
		const instance = createMockInstance()
		instance.ZoomGroupData = [
			{ groupName: 'Hosts', users: [] },
			{ groupName: 'Spotlights', users: [] },
		]
		Object.assign(instance.config, { host: '127.0.0.1', tx_port: zoomPort, rx_port: rxPort })
		const connection = new OSC(instance)
		cleanup.push(async () => connection.destroy())

		const zoom = new osc.UDPPort({
			localAddress: '127.0.0.1',
			localPort: zoomPort,
			remoteAddress: '127.0.0.1',
			remotePort: rxPort,
			metadata: true,
		})
		const zoomReady = new Promise<void>((resolve) => zoom.once('ready', resolve))
		zoom.open()
		cleanup.push(() => zoom.close())
		await zoomReady
		await vi.waitFor(() => expect(instance.log).toHaveBeenCalledWith('info', `Listening to ZoomOSC on port: ${rxPort}`))

		const send = (packet: unknown) => zoom.send(packet as OscPacket)
		return { instance, connection, zoom, send, rxPort }
	}

	it('handles every message inside a bundle', async () => {
		const { instance, send } = await connect()
		send({ timeTag: { raw: [0, 1] }, packets: [online(101, 'Alice'), online(102, 'Bob')] })

		await vi.waitFor(() =>
			expect(instance.ZoomVariableLink).toEqual([
				{ zoomId: 101, userName: 'Alice' },
				{ zoomId: 102, userName: 'Bob' },
			]),
		)
	})

	it('reads gallery order and spot order with 32-bit Zoom IDs, as ZoomOSC 4 and ZoomISO 3.0.6 send them', async () => {
		const { instance, send } = await connect()
		send(online(101, 'Alice'))
		send(online(102, 'Bob'))
		await vi.waitFor(() => expect(instance.ZoomVariableLink).toHaveLength(2))

		send({ address: '/zoomosc/galleryOrder', args: [i(102), i(101)] })
		await vi.waitFor(() => expect(instance.ZoomClientDataObj.galleryOrder).toEqual([102, 101]))

		send({ address: '/zoomosc/spotOrder', args: [i(101)] })
		await vi.waitFor(() => expect(instance.ZoomGroupData[1].users).toEqual([{ zoomID: 101, userName: 'Alice' }]))
		expect(instance.log).not.toHaveBeenCalledWith('error', expect.anything())
		expect(instance.log).not.toHaveBeenCalledWith('warn', expect.anything())
	})
	it('reads spot order and gallery order with 64-bit Zoom IDs, as ZoomOSC 5.0.1 and ZoomISO 3.0.7 send them', async () => {
		const { instance, send } = await connect()
		send(online(33555456, 'Alice'))
		send(online(33556480, 'Bob'))
		send(online(33557504, 'Carol'))
		await vi.waitFor(() => expect(instance.ZoomVariableLink).toHaveLength(3))

		// as ZoomOSC 5.0.1 sent it on 2026-11-14: a plain list of h (int64) arguments
		const h = (low: number) => ({ type: 'h', value: { high: 0, low } })
		send({ address: '/zoomosc/spotOrder', args: [h(33555456), h(33556480), h(33557504)] })
		await vi.waitFor(() =>
			expect(instance.ZoomGroupData[1].users).toEqual([
				{ zoomID: 33555456, userName: 'Alice' },
				{ zoomID: 33556480, userName: 'Bob' },
				{ zoomID: 33557504, userName: 'Carol' },
			]),
		)

		send({ address: '/zoomosc/galleryOrder', args: [h(33557504), h(33555456)] })
		await vi.waitFor(() => expect(instance.ZoomClientDataObj.galleryOrder).toEqual([33557504, 33555456]))
		expect(instance.log).not.toHaveBeenCalledWith('error', expect.anything())
	})

	it('keeps a whole-number decimal a decimal', async () => {
		const port = await freePort()
		const receiver = createOscPort(port, '127.0.0.1', 9)
		const received = new Promise<Message>((resolve) => receiver.on('message', resolve))
		const ready = new Promise<void>((resolve) => receiver.once('ready', resolve))
		receiver.open()
		cleanup.push(() => receiver.close())
		await ready

		const sender = new osc.UDPPort({ localAddress: '127.0.0.1', localPort: 0, remotePort: port, metadata: true })
		const senderReady = new Promise<void>((resolve) => sender.once('ready', resolve))
		sender.open()
		cleanup.push(() => sender.close())
		await senderReady
		sender.send({ address: '/zoomosc/level', args: [{ type: 'f', value: 1 }, i(1)] })

		expect(toZoomOSCResponse(await received).args).toEqual([
			{ type: 'f', value: 1 },
			{ type: 'i', value: 1 },
		])
	})

	it('sends commands to ZoomOSC/ISO with their types, from the receiving port as 4.11 did', async () => {
		const { connection, zoom, rxPort } = await connect()
		const received = new Promise<{ message: Message; from: number }>((resolve) =>
			zoom.on('message', (message, _timeTag, info) => {
				if (message.address === '/zoom/galTrackMode') resolve({ message, from: info.port })
			}),
		)

		connection.sendCommand('/zoom/galTrackMode', [{ type: 'i', value: 1 }])

		const { message, from } = await received
		expect(message.args).toEqual([{ type: 'i', value: 1 }])
		expect(from).toBe(rxPort)
	})

	it('warns about a packet it cannot read instead of dropping it silently', async () => {
		const { instance, rxPort } = await connect()
		const raw = createSocket('udp4')
		cleanup.push(() => void raw.close())
		raw.send(Buffer.from('/zoomosc/bad\0\0\0\0,x\0\0'), rxPort, '127.0.0.1')

		await vi.waitFor(() =>
			expect(instance.log).toHaveBeenCalledWith('warn', expect.stringContaining('OSC error from ZoomOSC/ISO')),
		)
	})
})
