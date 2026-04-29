import { jest } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsSocalSteam, ActionIdSocialStream } from '../../src/actions/action-social-stream.js'
import { socialStreamApi } from '../../src/socialstream.js'
import type { InstanceBaseExt } from '../../src/utils.js'
import type { ZoomConfig } from '../../src/config.js'

// Mock got to prevent real HTTP calls from socialstream internals
jest.mock('got', () => ({
	default: { post: jest.fn().mockResolvedValue({ body: 'ok' } as never) },
}))

describe('GetActionsSocalSteam', () => {
	let instance: InstanceBaseExt<ZoomConfig>
	let actions: ReturnType<typeof GetActionsSocalSteam>
	let postMessageSpy: ReturnType<typeof jest.spyOn>

	beforeAll(() => {
		instance = createMockInstance()
		actions = GetActionsSocalSteam(instance)
	})

	beforeEach(() => {
		const anyInstance = instance as any
		anyInstance.saveConfig = jest.fn()
		postMessageSpy = jest.spyOn(socialStreamApi, 'postMessage').mockResolvedValue(undefined as never)
		jest.clearAllMocks()
		// Re-spy after clearAllMocks since clearAllMocks resets mock state
		postMessageSpy = jest.spyOn(socialStreamApi, 'postMessage').mockResolvedValue(undefined as never)
	})

	afterEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
	})

	// ── sendAChatToSocialStream ───────────────────────────────────────────────

	describe('sendAChatToSocialStream', () => {
		it('calls socialStreamApi.postMessage when enableSocialStream is true', async () => {
			instance.config.enableSocialStream = true
			await (actions[ActionIdSocialStream.sendAChatToSocialStream] as any).callback(
				{ options: { name: 'Alice', message: 'Hello' } } as any,
				{} as any,
			)
			expect(postMessageSpy).toHaveBeenCalledWith('Alice', 'Hello', instance)
		})

		it('logs a warning and skips postMessage when enableSocialStream is false', async () => {
			instance.config.enableSocialStream = false
			await (actions[ActionIdSocialStream.sendAChatToSocialStream] as any).callback(
				{ options: { name: 'Alice', message: 'Hello' } } as any,
				{} as any,
			)
			expect(postMessageSpy).not.toHaveBeenCalled()
			expect(instance.log).toHaveBeenCalledWith('warn', 'Social Stream is not enabled in config')
		})

		it('passes through v2-resolved name and message values before posting', async () => {
			instance.config.enableSocialStream = true
			await (actions[ActionIdSocialStream.sendAChatToSocialStream] as any).callback(
				{ options: { name: 'Resolved Name', message: 'Resolved Message' } } as any,
				{} as any,
			)
			expect(postMessageSpy).toHaveBeenCalledWith('Resolved Name', 'Resolved Message', instance)
		})
	})

	// ── turnOnSocialStream ────────────────────────────────────────────────────

	describe('turnOnSocialStream', () => {
		it('sets enableSocialStream to true when currently false', async () => {
			instance.config.enableSocialStream = false
			await (actions[ActionIdSocialStream.turnOnSocialStream] as any).callback({} as any, {} as any)
			expect(instance.config.enableSocialStream).toBe(true)
			expect((instance as any).saveConfig).toHaveBeenCalledWith(instance.config)
		})

		it('does not call saveConfig when already enabled', async () => {
			instance.config.enableSocialStream = true
			await (actions[ActionIdSocialStream.turnOnSocialStream] as any).callback({} as any, {} as any)
			expect((instance as any).saveConfig).not.toHaveBeenCalled()
		})
	})

	// ── turnOffSocialStream ───────────────────────────────────────────────────

	describe('turnOffSocialStream', () => {
		it('sets enableSocialStream to false when currently true', async () => {
			instance.config.enableSocialStream = true
			await (actions[ActionIdSocialStream.turnOffSocialStream] as any).callback({} as any, {} as any)
			expect(instance.config.enableSocialStream).toBe(false)
			expect((instance as any).saveConfig).toHaveBeenCalledWith(instance.config)
		})

		it('does not call saveConfig when already disabled', async () => {
			instance.config.enableSocialStream = false
			await (actions[ActionIdSocialStream.turnOffSocialStream] as any).callback({} as any, {} as any)
			expect((instance as any).saveConfig).not.toHaveBeenCalled()
		})
	})

	// ── toggleSocialStream ────────────────────────────────────────────────────

	describe('toggleSocialStream', () => {
		it('toggles false → true', async () => {
			instance.config.enableSocialStream = false
			await (actions[ActionIdSocialStream.toggleSocialStream] as any).callback({} as any, {} as any)
			expect(instance.config.enableSocialStream).toBe(true)
			expect((instance as any).saveConfig).toHaveBeenCalled()
		})

		it('toggles true → false', async () => {
			instance.config.enableSocialStream = true
			await (actions[ActionIdSocialStream.toggleSocialStream] as any).callback({} as any, {} as any)
			expect(instance.config.enableSocialStream).toBe(false)
			expect((instance as any).saveConfig).toHaveBeenCalled()
		})
	})
})
