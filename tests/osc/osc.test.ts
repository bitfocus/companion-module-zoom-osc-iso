import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import type { EventEmitter } from 'node:events'
import osc from 'osc'
import { OSC } from '../../src/osc.js'
import { createMockInstance } from '../helpers/mock-instance.js'

// osc is mocked in tests/setup.ts (vi.mock), so this import resolves to that mock
type FakePort = EventEmitter & { options: Record<string, unknown>; open: Mock; send: Mock; close: Mock }
const ports = (osc.UDPPort as unknown as { instances: FakePort[] }).instances
const lastPort = () => ports[ports.length - 1]

beforeEach(() => {
	ports.length = 0
})

describe('OSC connection', () => {
	it('opens one port that listens on every address and sends to ZoomOSC/ISO, as 4.11 did', () => {
		const instance = createMockInstance()
		Object.assign(instance.config, { host: '10.0.0.5', tx_port: 9191, rx_port: 1300 })
		new OSC(instance)

		expect(ports).toHaveLength(1)
		expect(lastPort().options).toEqual({
			localAddress: '0.0.0.0',
			localPort: 1300,
			remoteAddress: '10.0.0.5',
			remotePort: 9191,
			metadata: true,
		})
		expect(lastPort().open).toHaveBeenCalledTimes(1)
	})

	it('hands each received message to the handlers in the { address, args: [{ type, value }] } shape', async () => {
		const instance = createMockInstance()
		new OSC(instance)

		lastPort().emit('message', {
			address: '/zoomosc/user/online',
			args: [
				{ type: 'i', value: 0 },
				{ type: 's', value: 'Alice' },
				{ type: 'i', value: 1 },
				{ type: 'i', value: 101 },
			],
		})
		await new Promise((resolve) => setTimeout(resolve, 0))

		expect(instance.ZoomVariableLink).toEqual([{ zoomId: 101, userName: 'Alice' }])
	})

	it('reports a port already in use as an error, and any other receive error as a warning, once a minute', () => {
		vi.useFakeTimers()
		try {
			const instance = createMockInstance()
			new OSC(instance)
			const port = lastPort()

			port.emit('error', Object.assign(new Error('bind EADDRINUSE 0.0.0.0:1234'), { code: 'EADDRINUSE' }))
			expect(instance.log).toHaveBeenCalledWith('error', expect.stringContaining('Selected port in use.'))

			const unreadable = new Error("'x' is not a valid OSC type tag")
			port.emit('error', unreadable)
			port.emit('error', unreadable)
			const warnings = () => vi.mocked(instance.log).mock.calls.filter(([level]) => level === 'warn')
			expect(warnings()).toEqual([['warn', "OSC error from ZoomOSC/ISO: 'x' is not a valid OSC type tag"]])

			vi.advanceTimersByTime(61000)
			port.emit('error', unreadable)
			expect(warnings()).toHaveLength(2)
		} finally {
			vi.useRealTimers()
		}
	})
})

describe('OSC destroy', () => {
	it('waits for the port to close before resolving destroy', async () => {
		const osc = new OSC(createMockInstance())
		const port = lastPort()
		port.close.mockImplementation(() => {})

		const destroyPromise = osc.destroy()
		let resolved = false
		void destroyPromise.then(() => {
			resolved = true
		})

		await Promise.resolve()
		expect(port.close).toHaveBeenCalledTimes(1)
		expect(resolved).toBe(false)

		port.emit('close')
		await destroyPromise
		expect(resolved).toBe(true)
	})

	it('does not wait for ever when the port never opened', async () => {
		vi.useFakeTimers()
		try {
			const osc = new OSC(createMockInstance())
			lastPort().close.mockImplementation(() => {})
			const destroyPromise = osc.destroy()
			await vi.advanceTimersByTimeAsync(1000)
			await expect(destroyPromise).resolves.toBeUndefined()
		} finally {
			vi.useRealTimers()
		}
	})
})

describe('OSC sendCommand', () => {
	it('sends typed arguments to ZoomOSC/ISO as given', () => {
		const osc = new OSC(createMockInstance())

		osc.sendCommand('/zoom/galTrackMode', [{ type: 'i', value: 1 }])
		osc.sendCommand('/zoom/ping')

		expect(lastPort().send).toHaveBeenNthCalledWith(1, {
			address: '/zoom/galTrackMode',
			args: [{ type: 'i', value: 1 }],
		})
		expect(lastPort().send).toHaveBeenNthCalledWith(2, { address: '/zoom/ping', args: [] })
	})

	it('logs a send that osc throws on instead of crashing', () => {
		const instance = createMockInstance()
		const osc = new OSC(instance)
		lastPort().send.mockImplementation(() => {
			throw new Error("'undefined' is not a valid OSC type tag")
		})

		osc.sendCommand('/zoom/zoomID/outputISO', [{ type: 'i', value: undefined as unknown as number }])

		expect(instance.log).toHaveBeenCalledWith(
			'error',
			expect.stringContaining('/zoom/zoomID/outputISO and args: [{"type":"i"}]. Error: \'undefined\' is not a valid'),
		)
	})

	it('logs instead of sending after the connection was stopped', async () => {
		const instance = createMockInstance()
		const osc = new OSC(instance)
		const port = lastPort()
		await osc.destroy()

		osc.sendCommand('/zoom/ping')

		expect(port.send).not.toHaveBeenCalled()
		expect(instance.log).toHaveBeenCalledWith('error', expect.stringContaining('OSC port is not open'))
	})
})

describe('OSC starting or joining a meeting', () => {
	const typed = (value: number | string) => ({ type: typeof value === 'string' ? 's' : 'i', value })
	/** ZoomOSC/ISO's answer to /zoom/ping: {version} {subscribeMode} {galTrackMode} {callStatus} ... {isPro} */
	const pong = (callStatus: number) => ({
		address: '/zoomosc/pong',
		args: [0, 'ZOSC_5.0.1_MAC', 2, 1, callStatus, 0, 45, 1].map(typed),
	})
	const sentCount = (port: FakePort, address: string) =>
		port.send.mock.calls.filter(([message]) => (message as { address: string }).address === address).length

	async function receive(port: FakePort, message: { address: string; args: unknown[] }): Promise<void> {
		port.emit('message', message)
		await vi.advanceTimersByTimeAsync(0)
	}

	beforeEach(() => {
		vi.useFakeTimers()
		return () => vi.useRealTimers()
	})

	it('asks for everyone in the meeting once, when it starts while ZoomOSC/ISO is already in one', async () => {
		const instance = createMockInstance()
		const connection = new OSC(instance)
		const port = lastPort()
		port.emit('ready')

		await receive(port, pong(1))
		expect(sentCount(port, '/zoom/list')).toBe(1)

		// the watchdog's later pongs don't ask again
		await receive(port, pong(1))
		expect(sentCount(port, '/zoom/list')).toBe(1)

		// a new connection (the module restarting, a config change) asks again
		const stopped = connection.destroy()
		await vi.advanceTimersByTimeAsync(0)
		await stopped
		new OSC(instance)
		await receive(lastPort(), pong(1))
		expect(sentCount(lastPort(), '/zoom/list')).toBe(1)
	})

	it('does not ask for the list when ZoomOSC/ISO is not in a meeting', async () => {
		new OSC(createMockInstance())
		const port = lastPort()
		await receive(port, pong(0))
		expect(sentCount(port, '/zoom/list')).toBe(0)
	})

	it('keeps one ZoomISO polling timer when a join reports Audio Ready and then In Meeting', async () => {
		const instance = createMockInstance()
		instance.config.version = 1 // ZoomISO
		new OSC(instance)
		const port = lastPort()
		const status = (value: number) => ({ address: '/zoomosc/meetingStatusChanged', args: [value, 0, 0].map(typed) })

		await receive(port, status(8))
		await receive(port, status(3))
		port.send.mockClear()

		// the engine state is unknown, so each polling timer asks for it once per 5 seconds
		await vi.advanceTimersByTimeAsync(5000)
		expect(sentCount(port, '/zoom/getEngineState')).toBe(1)
	})
})
