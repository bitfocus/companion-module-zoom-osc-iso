import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { OSC } from '../../src/osc.js'
import { createMockInstance } from '../helpers/mock-instance.js'

const nodeOscMock = jest.requireMock('node-osc') as {
	Client: jest.Mock
	Server: jest.Mock
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
			send: jest.fn(),
			close: jest.fn(async () => clientClosePromise),
		}))
		nodeOscMock.Server.mockImplementation((...args: unknown[]) => {
			const ready = args[2] as (() => void) | undefined
			ready?.()
			return {
				on: jest.fn().mockReturnThis(),
				close: jest.fn(async () => serverClosePromise),
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
