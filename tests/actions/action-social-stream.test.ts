import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsSocalSteam, ActionIdSocialStream } from '../../src/actions/action-social-stream.js'
import { socialStreamApi } from '../../src/socialstream.js'
import type { InstanceBaseExt } from '../../src/utils.js'
import type { ZoomConfig } from '../../src/config.js'

// Mock got-cjs to prevent real HTTP calls from socialstream internals
jest.mock('got-cjs', () => ({
	default: { post: jest.fn().mockResolvedValue({ body: 'ok' } as never) },
}))

describe('GetActionsSocalSteam', () => {
	let instance: InstanceBaseExt<ZoomConfig>
	let postMessageSpy: ReturnType<typeof jest.spyOn>

	beforeEach(() => {
		instance = createMockInstance()
		;(instance as any).saveConfig = jest.fn()
		postMessageSpy = jest.spyOn(socialStreamApi, 'postMessage').mockResolvedValue(undefined as never)
		jest.clearAllMocks()
		// Re-spy after clearAllMocks since clearAllMocks resets mock state
		postMessageSpy = jest.spyOn(socialStreamApi, 'postMessage').mockResolvedValue(undefined as never)
	})

	// ── sendAChatToSocialStream ───────────────────────────────────────────────

	describe('sendAChatToSocialStream', () => {
		it('calls socialStreamApi.postMessage when enableSocialStream is true', async () => {
			instance.config.enableSocialStream = true
			const actions = GetActionsSocalSteam(instance)
			await (actions[ActionIdSocialStream.sendAChatToSocialStream] as any).callback(
				{ options: { name: 'Alice', message: 'Hello' } } as any,
				{} as any
			)
			expect(postMessageSpy).toHaveBeenCalledWith('Alice', 'Hello', instance)
		})

		it('logs a warning and skips postMessage when enableSocialStream is false', async () => {
			instance.config.enableSocialStream = false
			const actions = GetActionsSocalSteam(instance)
			await (actions[ActionIdSocialStream.sendAChatToSocialStream] as any).callback(
				{ options: { name: 'Alice', message: 'Hello' } } as any,
				{} as any
			)
			expect(postMessageSpy).not.toHaveBeenCalled()
			expect(instance.log).toHaveBeenCalledWith('warn', 'Social Stream is not enabled in config')
		})

		it('resolves variables in name and message before posting', async () => {
			instance.config.enableSocialStream = true
			// action resolves message first, then name
			;(instance.parseVariablesInString as jest.Mock)
				.mockResolvedValueOnce('Resolved Message' as never)
				.mockResolvedValueOnce('Resolved Name' as never)
			const actions = GetActionsSocalSteam(instance)
			await (actions[ActionIdSocialStream.sendAChatToSocialStream] as any).callback(
				{ options: { name: '$(var:name)', message: '$(var:msg)' } } as any,
				{} as any
			)
			expect(postMessageSpy).toHaveBeenCalledWith('Resolved Name', 'Resolved Message', instance)
		})
	})

	// ── turnOnSocialStream ────────────────────────────────────────────────────

	describe('turnOnSocialStream', () => {
		it('sets enableSocialStream to true when currently false', async () => {
			instance.config.enableSocialStream = false
			const actions = GetActionsSocalSteam(instance)
			await (actions[ActionIdSocialStream.turnOnSocialStream] as any).callback({} as any, {} as any)
			expect(instance.config.enableSocialStream).toBe(true)
			expect((instance as any).saveConfig).toHaveBeenCalledWith(instance.config)
		})

		it('does not call saveConfig when already enabled', async () => {
			instance.config.enableSocialStream = true
			const actions = GetActionsSocalSteam(instance)
			await (actions[ActionIdSocialStream.turnOnSocialStream] as any).callback({} as any, {} as any)
			expect((instance as any).saveConfig).not.toHaveBeenCalled()
		})
	})

	// ── turnOffSocialStream ───────────────────────────────────────────────────

	describe('turnOffSocialStream', () => {
		it('sets enableSocialStream to false when currently true', async () => {
			instance.config.enableSocialStream = true
			const actions = GetActionsSocalSteam(instance)
			await (actions[ActionIdSocialStream.turnOffSocialStream] as any).callback({} as any, {} as any)
			expect(instance.config.enableSocialStream).toBe(false)
			expect((instance as any).saveConfig).toHaveBeenCalledWith(instance.config)
		})

		it('does not call saveConfig when already disabled', async () => {
			instance.config.enableSocialStream = false
			const actions = GetActionsSocalSteam(instance)
			await (actions[ActionIdSocialStream.turnOffSocialStream] as any).callback({} as any, {} as any)
			expect((instance as any).saveConfig).not.toHaveBeenCalled()
		})
	})

	// ── toggleSocialStream ────────────────────────────────────────────────────

	describe('toggleSocialStream', () => {
		it('toggles false → true', async () => {
			instance.config.enableSocialStream = false
			const actions = GetActionsSocalSteam(instance)
			await (actions[ActionIdSocialStream.toggleSocialStream] as any).callback({} as any, {} as any)
			expect(instance.config.enableSocialStream).toBe(true)
			expect((instance as any).saveConfig).toHaveBeenCalled()
		})

		it('toggles true → false', async () => {
			instance.config.enableSocialStream = true
			const actions = GetActionsSocalSteam(instance)
			await (actions[ActionIdSocialStream.toggleSocialStream] as any).callback({} as any, {} as any)
			expect(instance.config.enableSocialStream).toBe(false)
			expect((instance as any).saveConfig).toHaveBeenCalled()
		})
	})
})

