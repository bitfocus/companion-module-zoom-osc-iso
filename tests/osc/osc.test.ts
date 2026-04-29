import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { InstanceStatus } from '@companion-module/base'
import { FeedbackId } from '../../src/feedback.js'
import { ZoomVersion } from '../../src/utils.js'
import { createMockInstance } from '../helpers/mock-instance.js'

jest.unstable_mockModule('node-osc', () => ({
	Client: jest.fn(),
	Server: jest.fn(),
}))

const { OSC } = await import('../../src/osc.js')
const nodeOscMock = (await import('node-osc')) as unknown as {
	Client: jest.Mock
	Server: jest.Mock
}

const oscInstances: InstanceType<typeof OSC>[] = []

describe('OSC', () => {
	beforeEach(() => {
		nodeOscMock.Client.mockReset()
		nodeOscMock.Server.mockReset()
	})

	afterEach(async () => {
		for (const osc of oscInstances.splice(0)) {
			await osc.destroy()
		}
		jest.useRealTimers()
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
		oscInstances.push(osc)
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

	it('polls engine state before ISO polling commands when ZoomISO is enabled', () => {
		jest.useFakeTimers()

		nodeOscMock.Client.mockImplementation(() => ({
			send: jest.fn(),
			close: jest.fn(),
		}))
		nodeOscMock.Server.mockImplementation(() => ({
			on: jest.fn().mockReturnThis(),
			close: jest.fn(),
		}))

		const instance = createMockInstance()
		instance.config.version = ZoomVersion.ZoomISO
		instance.config.pulling = 500
		const osc = new OSC(instance)
		oscInstances.push(osc)
		const sendCommandSpy = jest.spyOn(osc, 'sendCommand')

		osc.createZoomIsoPullerTimer()
		jest.advanceTimersByTime(5000)

		expect(sendCommandSpy).toHaveBeenCalledWith('/zoom/getEngineState', [])
		osc.destroyTimers()
	})

	it('updates definitions and feedbacks on the first presets timer tick', () => {
		jest.useFakeTimers()

		nodeOscMock.Client.mockImplementation(() => ({
			send: jest.fn(),
			close: jest.fn(),
		}))
		nodeOscMock.Server.mockImplementation(() => ({
			on: jest.fn().mockReturnThis(),
			close: jest.fn(),
		}))

		const instance = createMockInstance()
		const osc = new OSC(instance)
		oscInstances.push(osc)

		osc.createUpdatePresetsTimer()
		jest.advanceTimersByTime(2000)

		expect(instance.updateDefinitionsForActionsFeedbacksAndPresets).toHaveBeenCalled()
		expect(instance.checkFeedbacks).toHaveBeenCalledWith(
			FeedbackId.userNameBased,
			FeedbackId.userNameBasedAdvanced,
			FeedbackId.indexBased,
			FeedbackId.indexBasedAdvanced,
			FeedbackId.galleryBased,
			FeedbackId.galleryBasedAdvanced,
			FeedbackId.groupBased,
			FeedbackId.groupBasedAdvanced,
			FeedbackId.selectionMethod,
			FeedbackId.audioOutput,
			FeedbackId.output,
		)
		expect(instance.updateStatus).toHaveBeenCalledWith(InstanceStatus.Connecting)
		osc.destroyTimers()
	})

	it('logs an error when sendCommand is called after destroy clears the client', async () => {
		nodeOscMock.Client.mockImplementation(() => ({
			send: jest.fn(),
			close: jest.fn(async () => undefined),
		}))
		nodeOscMock.Server.mockImplementation(() => ({
			on: jest.fn().mockReturnThis(),
			close: jest.fn(async () => undefined),
		}))

		const instance = createMockInstance()
		const osc = new OSC(instance)
		oscInstances.push(osc)

		await osc.destroy()
		osc.sendCommand('/zoom/ping')

		expect(instance.log).toHaveBeenCalledWith(
			'error',
			expect.stringContaining('sendCommand error for path: /zoom/ping'),
		)
	})
})
