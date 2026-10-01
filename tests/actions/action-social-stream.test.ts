import { describe, it, expect, vi, beforeAll, beforeEach, afterEach, type Mock, type MockInstance } from 'vitest'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsSocalSteam, ActionIdSocialStream } from '../../src/actions/action-social-stream.js'
import { socialStreamApi } from '../../src/socialstream.js'

// Mock got-cjs to prevent real HTTP calls from socialstream internals
vi.mock('got-cjs', () => {
	const got = { post: vi.fn().mockResolvedValue({ body: 'ok' } as never) }
	return { default: got, got }
})

describe('GetActionsSocalSteam', () => {
	let instance: ReturnType<typeof createMockInstance>
	let actions: ReturnType<typeof GetActionsSocalSteam>
	let postMessageSpy: MockInstance<typeof socialStreamApi.postMessage>

	beforeAll(() => {
		instance = createMockInstance()
		actions = GetActionsSocalSteam(instance)
	})

	beforeEach(() => {
		const anyInstance = instance as any
		anyInstance.saveConfig = vi.fn()
		postMessageSpy = vi.spyOn(socialStreamApi, 'postMessage').mockResolvedValue(undefined as never)
		vi.clearAllMocks()
		// Re-spy after clearAllMocks since clearAllMocks resets mock state
		postMessageSpy = vi.spyOn(socialStreamApi, 'postMessage').mockResolvedValue(undefined as never)
	})

	afterEach(() => {
		const sendCommand = instance.OSC.sendCommand as Mock
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

		// v2: Companion parses variables before the callback runs, for fields with useVariables
		it('lets Companion resolve variables in name and message', () => {
			const definition = actions[ActionIdSocialStream.sendAChatToSocialStream] as any
			const fields = definition.options.filter((o: any) => o.id === 'name' || o.id === 'message')
			expect(fields).toHaveLength(2)
			for (const field of fields) expect(field).toMatchObject({ type: 'textinput', useVariables: true })
		})

		it('posts the already-resolved name and message', async () => {
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
