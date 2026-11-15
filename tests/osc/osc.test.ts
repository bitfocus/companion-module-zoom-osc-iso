import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { OSC } from '../../src/osc.js'
import { createMockInstance } from '../helpers/mock-instance.js'
import * as nodeOscModule from 'node-osc'
import { createSocket } from 'node:dgram'

// node-osc and node:dgram are mocked in tests/setup.ts (vi.mock), so these imports resolve to those mocks
const nodeOscMock = nodeOscModule as unknown as {
	Client: Mock
}
const createSocketMock = createSocket as unknown as Mock

describe('OSC destroy', () => {
	beforeEach(() => {
		nodeOscMock.Client.mockReset()
		createSocketMock.mockClear()
	})

	it('waits for the receiving socket and the node-osc client to close before resolving destroy', async () => {
		let resolveClientClose!: () => void
		const clientClosePromise = new Promise<void>((resolve) => {
			resolveClientClose = resolve
		})
		nodeOscMock.Client.mockImplementation(() => ({
			send: vi.fn(),
			close: vi.fn(async () => clientClosePromise),
		}))

		const osc = new OSC(createMockInstance())
		const server = createSocketMock.mock.results[0].value as { close: Mock }
		let closeServer!: () => void
		server.close.mockImplementation((callback: () => void) => {
			closeServer = callback
		})

		const destroyPromise = osc.destroy()
		let resolved = false
		void destroyPromise.then(() => {
			resolved = true
		})

		await Promise.resolve()
		expect(resolved).toBe(false)

		closeServer()
		await Promise.resolve()
		expect(resolved).toBe(false)

		resolveClientClose()
		await destroyPromise
		expect(resolved).toBe(true)
	})
})

describe('OSC sendCommand', () => {
	beforeEach(() => {
		nodeOscMock.Client.mockReset()
	})

	it('logs a send that node-osc rejects instead of leaving the rejection unhandled', async () => {
		nodeOscMock.Client.mockImplementation(() => ({
			send: vi.fn(async () => Promise.reject(new Error("Don't know how to encode argument: [object Object]"))),
			close: vi.fn(async () => {}),
		}))
		const instance = createMockInstance()
		const osc = new OSC(instance)

		osc.sendCommand('/zoom/zoomID/outputISO', [{ type: 'i', value: undefined as unknown as number }])
		await new Promise((resolve) => setTimeout(resolve, 0))

		expect(instance.log).toHaveBeenCalledWith(
			'error',
			expect.stringContaining(
				'/zoom/zoomID/outputISO and args: [{"type":"i"}]. Error: Don\'t know how to encode argument',
			),
		)
	})
})
