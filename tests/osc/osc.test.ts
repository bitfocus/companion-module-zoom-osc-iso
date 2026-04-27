import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { OSC } from '../../src/osc.js'
import { createMockInstance } from '../helpers/mock-instance.js'

type CloseCallback = (() => void) | undefined

const nodeOscMock = jest.requireMock('node-osc') as {
	Client: jest.Mock
	Server: jest.Mock
}

describe('OSC destroy', () => {
	beforeEach(() => {
		nodeOscMock.Client.mockReset()
		nodeOscMock.Server.mockReset()
	})

	it('waits for node-osc close callbacks before resolving destroy', async () => {
		let serverCloseCallback: CloseCallback
		let clientCloseCallback: CloseCallback

		nodeOscMock.Client.mockImplementation(() => ({
			send: jest.fn(),
			close: jest.fn((callback?: () => void) => {
				clientCloseCallback = callback
			}),
		}))
		nodeOscMock.Server.mockImplementation((...args: unknown[]) => {
			const ready = args[2] as (() => void) | undefined
			ready?.()
			return {
				on: jest.fn().mockReturnThis(),
				close: jest.fn((callback?: () => void) => {
					serverCloseCallback = callback
				}),
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

		serverCloseCallback?.()
		await Promise.resolve()
		expect(resolved).toBe(false)

		clientCloseCallback?.()
		await destroyPromise
		expect(resolved).toBe(true)
	})
})
