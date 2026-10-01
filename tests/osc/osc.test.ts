import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { OSC } from '../../src/osc.js'
import { createMockInstance } from '../helpers/mock-instance.js'
import * as nodeOscModule from 'node-osc'

// node-osc is mocked in tests/setup.ts (vi.mock), so this import resolves to that mock
const nodeOscMock = nodeOscModule as unknown as {
	Client: Mock
	Server: Mock
}

describe('OSC destroy', () => {
	beforeEach(() => {
		nodeOscMock.Client.mockReset()
		nodeOscMock.Server.mockReset()
	})

	it('waits for node-osc close promises before resolving destroy', async () => {
		let resolveServerClose!: () => void
		let resolveClientClose!: () => void
		const serverClosePromise = new Promise<void>((resolve) => {
			resolveServerClose = resolve
		})
		const clientClosePromise = new Promise<void>((resolve) => {
			resolveClientClose = resolve
		})

		nodeOscMock.Client.mockImplementation(() => ({
			send: vi.fn(),
			close: vi.fn(async () => clientClosePromise),
		}))
		nodeOscMock.Server.mockImplementation((...args: unknown[]) => {
			const ready = args[2] as (() => void) | undefined
			ready?.()
			return {
				on: vi.fn().mockReturnThis(),
				close: vi.fn(async () => serverClosePromise),
			}
		})

		const osc = new OSC(createMockInstance())
		const destroyPromise = osc.destroy()
		let resolved = false
		void destroyPromise.then(() => {
			resolved = true
		})

		await Promise.resolve()
		expect(resolved).toBe(false)

		resolveServerClose()
		await Promise.resolve()
		expect(resolved).toBe(false)

		resolveClientClose()
		await destroyPromise
		expect(resolved).toBe(true)
	})
})
