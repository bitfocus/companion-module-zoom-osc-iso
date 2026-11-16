import { afterEach, describe, expect, it, vi } from 'vitest'

// real osc over real UDP on localhost: ZoomOSC/ISO -> this module -> the application OSC is forwarded to
vi.unmock('osc')
const { default: osc } = await import('osc')
const { createSocket } = await import('node:dgram')
const { OSC } = await import('../../src/osc.js')
const { createMockInstance } = await import('../helpers/mock-instance.js')

type OscPacket = Parameters<InstanceType<typeof osc.UDPPort>['send']>[0]
/** The bytes osc puts on the wire for a packet: what ZoomOSC/ISO sent, and so what must be forwarded */
const encode = (packet: unknown) =>
	Buffer.from(
		(osc as unknown as { writePacket: (p: unknown, o: unknown) => Uint8Array }).writePacket(packet, { metadata: true }),
	)

const i = (value: number) => ({ type: 'i', value })
const s = (value: string) => ({ type: 's', value })
const h = (low: number) => ({ type: 'h', value: { high: 0, low } })
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

describe('forwarding OSC from ZoomOSC/ISO over real UDP', () => {
	const cleanup: Array<() => Promise<void> | void> = []

	afterEach(async () => {
		for (const step of cleanup.splice(0).reverse()) await step()
	})

	/** ZoomOSC/ISO (a real osc port), the module's connection, and the application OSC is forwarded to */
	async function connect() {
		const target = createSocket('udp4')
		const forwarded: Buffer[] = []
		target.on('message', (packet) => forwarded.push(packet))
		await new Promise<void>((resolve) => target.bind(0, '127.0.0.1', resolve))
		cleanup.push(() => void target.close())

		const [rxPort, zoomPort] = [await freePort(), await freePort()]
		const instance = createMockInstance()
		instance.ZoomGroupData = [
			{ groupName: 'Hosts', users: [] },
			{ groupName: 'Spotlights', users: [] },
		]
		Object.assign(instance.config, {
			host: '127.0.0.1',
			tx_port: zoomPort,
			rx_port: rxPort,
			enableOscForwarding: true,
			oscForwardHost: '127.0.0.1',
			oscForwardPort: target.address().port,
		})
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

		return { instance, connection, zoom, forwarded }
	}

	it('forwards 64-bit Zoom IDs, a whole-number decimal and a bundle byte for byte, and still handles them', async () => {
		const { instance, zoom, forwarded } = await connect()
		const packets = [
			online(33555456, 'Alice'),
			online(33556480, 'Bob'),
			// as ZoomOSC 5.0.1 sends spot order: 64-bit integers
			{ address: '/zoomosc/spotOrder', args: [h(33556480), h(33555456)] },
			// 1.0 must arrive as a decimal, not as the integer 1 (an address the module doesn't act on)
			{ address: '/zoomosc/forwardingTest', args: [{ type: 'f', value: 1 }, i(1)] },
			{ timeTag: { raw: [0, 1] }, packets: [online(101, 'Carol'), online(102, 'Dan')] },
		]
		for (const packet of packets) zoom.send(packet as OscPacket)

		await vi.waitFor(() => expect(forwarded).toHaveLength(packets.length))
		expect(forwarded).toEqual(packets.map(encode))

		// the module still acts on every one of them
		await vi.waitFor(() =>
			expect(instance.ZoomGroupData[1].users).toEqual([
				{ zoomID: 33556480, userName: 'Bob' },
				{ zoomID: 33555456, userName: 'Alice' },
			]),
		)
		await vi.waitFor(() => expect(instance.ZoomVariableLink.map((user) => user.userName)).toContain('Dan'))
		expect(instance.log).not.toHaveBeenCalledWith('error', expect.anything())
	})

	it('never forwards the commands the module sends', async () => {
		const { connection, zoom, forwarded } = await connect()
		const atZoom = new Promise<void>((resolve) =>
			zoom.on('message', (message) => {
				if (message.address === '/zoom/galTrackMode') resolve()
			}),
		)

		connection.sendCommand('/zoom/galTrackMode', [{ type: 'i', value: 1 }])
		await atZoom
		await new Promise((resolve) => setTimeout(resolve, 100))

		expect(forwarded.filter((packet) => packet.includes('/zoom/galTrackMode'))).toEqual([])
	})
})
