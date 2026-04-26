import { describe, it, expect, beforeAll, beforeEach, afterEach } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { createCommand, sendActionCommand } from '../../src/actions/action-utils.js'
import type { InstanceBaseExt } from '../../src/utils.js'
import type { ZoomConfig } from '../../src/config.js'

describe('createCommand', () => {
	let instance: InstanceBaseExt<ZoomConfig>

	beforeEach(() => {
		instance = createMockInstance()
	})

	// ── Global commands (singleUser not provided → undefined) ─────────────────
	describe('global commands', () => {
		it('returns /zoom prefix path with no args', () => {
			const result = createCommand(instance, '/startLocalRecording')
			expect(result.oscPath).toBe('/zoom/startLocalRecording')
			expect(result.args).toEqual([])
			expect(result.isValidCommand).toBe(true)
		})

		it('works for any OSC action string', () => {
			const result = createCommand(instance, '/ping')
			expect(result.oscPath).toBe('/zoom/ping')
		})
	})

	// ── userName override ─────────────────────────────────────────────────────
	describe('userName override', () => {
		it('routes to /zoom/userName path with string arg for an arbitrary name', () => {
			const result = createCommand(instance, '/videoOn', 'John Smith', false)
			expect(result.oscPath).toBe('/zoom/userName/videoOn')
			expect(result.args).toEqual([{ type: 's', value: 'John Smith' }])
		})

		it('routes to /zoom/me for name "me" (lowercase)', () => {
			const result = createCommand(instance, '/videoOn', 'me', false)
			expect(result.oscPath).toBe('/zoom/me/videoOn')
			expect(result.args).toEqual([])
		})

		it('routes to /zoom/me for name "Me" (capitalised)', () => {
			const result = createCommand(instance, '/videoOn', 'Me', false)
			expect(result.oscPath).toBe('/zoom/me/videoOn')
		})

		it('routes to /zoom/all for name "all"', () => {
			const result = createCommand(instance, '/videoOn', 'all', false)
			expect(result.oscPath).toBe('/zoom/all/videoOn')
		})

		it('routes to /zoom/all for name "All"', () => {
			const result = createCommand(instance, '/videoOn', 'All', false)
			expect(result.oscPath).toBe('/zoom/all/videoOn')
		})

		it('routes to /zoom/allExcept/me when allExcept=true and name is "me"', () => {
			const result = createCommand(instance, '/videoOn', 'me', false, true)
			expect(result.oscPath).toBe('/zoom/allExcept/me/videoOn')
		})

		it('routes to /zoom/allExcept/all when allExcept=true and name is "all"', () => {
			const result = createCommand(instance, '/videoOn', 'all', false, true)
			expect(result.oscPath).toBe('/zoom/allExcept/all/videoOn')
		})

		it('routes to /zoom/allExcept/userName for arbitrary name when allExcept=true', () => {
			const result = createCommand(instance, '/videoOn', 'John Smith', false, true)
			expect(result.oscPath).toBe('/zoom/allExcept/userName/videoOn')
			expect(result.args).toEqual([{ type: 's', value: 'John Smith' }])
		})
	})

	// ── Selected callers ──────────────────────────────────────────────────────
	describe('selected callers', () => {
		it('returns isValidCommand=false when no callers selected and isoAllowSetUserToNone=false', () => {
			instance = createMockInstance({ selectedCallers: [] })
			const result = createCommand(instance, '/videoOn', '', false)
			expect(result.isValidCommand).toBe(false)
		})

		it('logs an error when no callers selected', () => {
			instance = createMockInstance({ selectedCallers: [] })
			createCommand(instance, '/videoOn', '', false)
			expect(instance.log).toHaveBeenCalledWith('error', 'Select a caller first')
		})

		it('uses single caller for singleUser=true', () => {
			instance = createMockInstance({ selectedCallers: [1001] })
			const result = createCommand(instance, '/videoOn', '', true)
			expect(result.oscPath).toBe('/zoom/zoomID/videoOn')
			expect(result.args).toEqual([{ type: 'i', value: 1001 }])
			expect(result.isValidCommand).toBe(true)
		})

		it('uses only first caller and warns when singleUser=true with multiple callers', () => {
			instance = createMockInstance({ selectedCallers: [1001, 1002] })
			const result = createCommand(instance, '/videoOn', '', true)
			expect(result.args).toEqual([{ type: 'i', value: 1001 }])
			expect(instance.log).toHaveBeenCalledWith('warn', expect.stringContaining('multiple participants'))
		})

		it('sends /zoom/zoomID path for single caller with singleUser=false', () => {
			instance = createMockInstance({ selectedCallers: [1001] })
			const result = createCommand(instance, '/videoOn', '', false)
			expect(result.oscPath).toBe('/zoom/zoomID/videoOn')
			expect(result.args).toEqual([{ type: 'i', value: 1001 }])
		})

		it('sends /zoom/users/zoomID path for multiple callers with singleUser=false', () => {
			instance = createMockInstance({ selectedCallers: [1001, 1002] })
			const result = createCommand(instance, '/videoOn', '', false)
			expect(result.oscPath).toBe('/zoom/users/zoomID/videoOn')
			expect(result.args).toEqual([
				{ type: 'i', value: 1001 },
				{ type: 'i', value: 1002 },
			])
		})

		it('uses /zoom/allExcept/zoomID for single caller with allExcept=true', () => {
			instance = createMockInstance({ selectedCallers: [1001] })
			const result = createCommand(instance, '/videoOn', '', false, true)
			expect(result.oscPath).toBe('/zoom/allExcept/zoomID/videoOn')
		})

		it('uses /zoom/allExcept/users/zoomID for multiple callers with allExcept=true', () => {
			instance = createMockInstance({ selectedCallers: [1001, 1002] })
			const result = createCommand(instance, '/videoOn', '', false, true)
			expect(result.oscPath).toBe('/zoom/allExcept/users/zoomID/videoOn')
		})

		it('uses /zoom/allExcept/ZoomID for /Mute with multiple callers and allExcept=true', () => {
			instance = createMockInstance({ selectedCallers: [1001, 1002] })
			const result = createCommand(instance, '/Mute', '', false, true)
			expect(result.oscPath).toBe('/zoom/allExcept/ZoomID/Mute')
		})
	})

	// ── ISO / none-user options ───────────────────────────────────────────────
	describe('ISO / none-user options', () => {
		it('sets args to emptyUser (-2) when isoAllowSetUserToNone=true and no callers selected', () => {
			instance = createMockInstance({ selectedCallers: [] })
			const result = createCommand(instance, '/setOutput', '', true, null, true, true)
			expect(result.args).toEqual([{ type: 'i', value: -2 }])
			expect(result.isValidCommand).toBe(true)
		})

		it('sets args to emptyUser (-2) when isoForceSetToNone=true regardless of caller', () => {
			instance = createMockInstance({ selectedCallers: [1001] })
			const result = createCommand(instance, '/setOutput', '', true, null, true, true, true)
			expect(result.args).toEqual([{ type: 'i', value: -2 }])
		})

		it('uses a custom emptyUser value when provided', () => {
			instance = createMockInstance({ selectedCallers: [] })
			const result = createCommand(instance, '/setOutput', '', true, null, true, true, false, 0)
			expect(result.args).toEqual([{ type: 'i', value: 0 }])
		})
	})
})

// ── sendActionCommand ──────────────────────────────────────────────────────────
describe('sendActionCommand', () => {
	let instance: ReturnType<typeof createMockInstance>

	beforeAll(() => {
		instance = createMockInstance()
	})

	afterEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
	})

	it('calls instance.OSC.sendCommand with path and args', () => {
		sendActionCommand(instance, {
			options: {
				command: '/zoom/startLocalRecording',
				args: [],
			},
		})
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/startLocalRecording', [])
	})

	it('passes args correctly', () => {
		const args = [{ type: 'i', value: 1001 }]
		sendActionCommand(instance, {
			options: { command: '/zoom/zoomID/videoOn', args },
		})
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/videoOn', args)
	})

	it('does not throw when instance.OSC is null/undefined', () => {
		const instance = createMockInstance()
		const anyInstance = instance as any
		anyInstance.OSC = null
		expect(() => sendActionCommand(instance, { options: { command: '/zoom/test', args: [] } })).not.toThrow()
	})
})
