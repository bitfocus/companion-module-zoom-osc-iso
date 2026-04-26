import { describe, it, expect, jest, beforeAll, beforeEach, afterEach } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsPerformanceTweaks, ActionIdPerformanceTweaks } from '../../src/actions/action-performance-tweaks.js'
import type { InstanceBaseExt } from '../../src/utils.js'
import type { ZoomConfig } from '../../src/config.js'

describe('GetActionsPerformanceTweaks', () => {
	let instance: InstanceBaseExt<ZoomConfig>
	let actions: ReturnType<typeof GetActionsPerformanceTweaks>

	beforeAll(() => {
		instance = createMockInstance()
		actions = GetActionsPerformanceTweaks(instance)
	})

	beforeEach(() => {
		const anyInstance = instance as any
		anyInstance.saveConfig = jest.fn()
	})

	afterEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
	})

	// ── EnableVariablesForEachUser ────────────────────────────────────────────

	describe('turnOnEnableVariablesForEachUser', () => {
		it('sets enableVariablesForEachUser to true when currently false', () => {
			instance.config.enableVariablesForEachUser = false
			const callback = (actions[ActionIdPerformanceTweaks.turnOnEnableVariablesForEachUser] as any).callback
			callback({} as any, {} as any)
			expect(instance.config.enableVariablesForEachUser).toBe(true)
			expect((instance as any).saveConfig).toHaveBeenCalledWith(instance.config)
		})

		it('does not call saveConfig when already enabled', () => {
			instance.config.enableVariablesForEachUser = true
			const callback = (actions[ActionIdPerformanceTweaks.turnOnEnableVariablesForEachUser] as any).callback
			callback({} as any, {} as any)
			expect((instance as any).saveConfig).not.toHaveBeenCalled()
		})
	})

	describe('turnOffEnableVariablesForEachUser', () => {
		it('sets enableVariablesForEachUser to false when currently true', () => {
			instance.config.enableVariablesForEachUser = true
			const callback = (actions[ActionIdPerformanceTweaks.turnOffEnableVariablesForEachUser] as any).callback
			callback({} as any, {} as any)
			expect(instance.config.enableVariablesForEachUser).toBe(false)
			expect((instance as any).saveConfig).toHaveBeenCalledWith(instance.config)
		})

		it('does not call saveConfig when already disabled', () => {
			instance.config.enableVariablesForEachUser = false
			const callback = (actions[ActionIdPerformanceTweaks.turnOffEnableVariablesForEachUser] as any).callback
			callback({} as any, {} as any)
			expect((instance as any).saveConfig).not.toHaveBeenCalled()
		})
	})

	describe('toggleEnableVariablesForEachUser', () => {
		it('toggles false → true', () => {
			instance.config.enableVariablesForEachUser = false
			const callback = (actions[ActionIdPerformanceTweaks.toggleEnableVariablesForEachUser] as any).callback
			callback({} as any, {} as any)
			expect(instance.config.enableVariablesForEachUser).toBe(true)
			expect((instance as any).saveConfig).toHaveBeenCalled()
		})

		it('toggles true → false', () => {
			instance.config.enableVariablesForEachUser = true
			const callback = (actions[ActionIdPerformanceTweaks.toggleEnableVariablesForEachUser] as any).callback
			callback({} as any, {} as any)
			expect(instance.config.enableVariablesForEachUser).toBe(false)
			expect((instance as any).saveConfig).toHaveBeenCalled()
		})
	})

	// ── EnableVariablesForParticipants ────────────────────────────────────────

	describe('turnOnEnableVariablesForParticipants', () => {
		it('sets enableVariablesForParticipants to true when currently false', () => {
			instance.config.enableVariablesForParticipants = false
			const callback = (actions[ActionIdPerformanceTweaks.turnOnEnableVariablesForParticipants] as any).callback
			callback({} as any, {} as any)
			expect(instance.config.enableVariablesForParticipants).toBe(true)
			expect((instance as any).saveConfig).toHaveBeenCalledWith(instance.config)
		})

		it('does not call saveConfig when already enabled', () => {
			instance.config.enableVariablesForParticipants = true
			const callback = (actions[ActionIdPerformanceTweaks.turnOnEnableVariablesForParticipants] as any).callback
			callback({} as any, {} as any)
			expect((instance as any).saveConfig).not.toHaveBeenCalled()
		})
	})

	describe('turnOffEnableVariablesForParticipants', () => {
		it('sets enableVariablesForParticipants to false when currently true', () => {
			instance.config.enableVariablesForParticipants = true
			const callback = (actions[ActionIdPerformanceTweaks.turnOffEnableVariablesForParticipants] as any).callback
			callback({} as any, {} as any)
			expect(instance.config.enableVariablesForParticipants).toBe(false)
			expect((instance as any).saveConfig).toHaveBeenCalledWith(instance.config)
		})

		it('does not call saveConfig when already disabled', () => {
			instance.config.enableVariablesForParticipants = false
			const callback = (actions[ActionIdPerformanceTweaks.turnOffEnableVariablesForParticipants] as any).callback
			callback({} as any, {} as any)
			expect((instance as any).saveConfig).not.toHaveBeenCalled()
		})
	})

	describe('toggleEnableVariablesForParticipants', () => {
		it('toggles false → true', () => {
			instance.config.enableVariablesForParticipants = false
			const callback = (actions[ActionIdPerformanceTweaks.toggleEnableVariablesForParticipants] as any).callback
			callback({} as any, {} as any)
			expect(instance.config.enableVariablesForParticipants).toBe(true)
			expect((instance as any).saveConfig).toHaveBeenCalled()
		})

		it('toggles true → false', () => {
			instance.config.enableVariablesForParticipants = true
			const callback = (actions[ActionIdPerformanceTweaks.toggleEnableVariablesForParticipants] as any).callback
			callback({} as any, {} as any)
			expect(instance.config.enableVariablesForParticipants).toBe(false)
			expect((instance as any).saveConfig).toHaveBeenCalled()
		})
	})
})
