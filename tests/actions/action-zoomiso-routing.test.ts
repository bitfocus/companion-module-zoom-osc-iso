import { describe, it, expect, beforeEach } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsZoomISORouting, ActionIdZoomISORouting } from '../../src/actions/action-zoomiso-routing.js'
import type { InstanceBaseExt } from '../../src/utils.js'
import type { ZoomConfig } from '../../src/config.js'

describe('GetActionsZoomISORouting', () => {
	let instance: InstanceBaseExt<ZoomConfig>

	beforeEach(() => {
		instance = createMockInstance()
	})

	describe(ActionIdZoomISORouting.outputISO, () => {
		it('sends /zoom/zoomID/outputISO with caller and output when caller is selected', async () => {
			instance = createMockInstance({ selectedCallers: [1001] })
			const actions = GetActionsZoomISORouting(instance)
			await (actions[ActionIdZoomISORouting.outputISO] as any).callback(
				{ options: { userName: '', output: 2, setToNoneIfNotUserSelected: false } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/outputISO', [
				{ type: 'i', value: 1001 },
				{ type: 'i', value: 2 },
			])
		})

		it('routes to /zoom/userName/outputISO when userName is provided', async () => {
			const actions = GetActionsZoomISORouting(instance)
			await (actions[ActionIdZoomISORouting.outputISO] as any).callback(
				{ options: { userName: 'John Doe', output: 1, setToNoneIfNotUserSelected: false } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/outputISO', expect.any(Array))
		})

		it('sends zoomId=-2 when setToNoneIfNotUserSelected=true and no caller selected', async () => {
			instance = createMockInstance({ selectedCallers: [] })
			const actions = GetActionsZoomISORouting(instance)
			await (actions[ActionIdZoomISORouting.outputISO] as any).callback(
				{ options: { userName: '', output: 3, setToNoneIfNotUserSelected: true } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/outputISO', [
				{ type: 'i', value: -2 },
				{ type: 'i', value: 3 },
			])
		})

		it('does not send OSC when no caller selected and setToNoneIfNotUserSelected=false', async () => {
			instance = createMockInstance({ selectedCallers: [] })
			const actions = GetActionsZoomISORouting(instance)
			await (actions[ActionIdZoomISORouting.outputISO] as any).callback(
				{ options: { userName: '', output: 1, setToNoneIfNotUserSelected: false } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).not.toHaveBeenCalled()
		})
	})

	describe(ActionIdZoomISORouting.audioISO, () => {
		it('sends /zoom/zoomID/audioISO with caller and output when caller is selected', async () => {
			instance = createMockInstance({ selectedCallers: [1002] })
			const actions = GetActionsZoomISORouting(instance)
			await (actions[ActionIdZoomISORouting.audioISO] as any).callback(
				{ options: { userName: '', output: 4 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/audioISO', [
				{ type: 'i', value: 1002 },
				{ type: 'i', value: 4 },
			])
		})

		it('routes to /zoom/userName/audioISO when userName is provided', async () => {
			const actions = GetActionsZoomISORouting(instance)
			await (actions[ActionIdZoomISORouting.audioISO] as any).callback(
				{ options: { userName: 'Jane', output: 2 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/userName/audioISO', expect.any(Array))
		})

		it('does not send OSC when no caller selected and no userName', async () => {
			instance = createMockInstance({ selectedCallers: [] })
			const actions = GetActionsZoomISORouting(instance)
			await (actions[ActionIdZoomISORouting.audioISO] as any).callback(
				{ options: { userName: '', output: 1 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).not.toHaveBeenCalled()
		})
	})

	describe(ActionIdZoomISORouting.outputISOSetToNone, () => {
		it('sends /zoom/zoomID/outputISO with zoomId=-2 and output (force set to none)', async () => {
			const actions = GetActionsZoomISORouting(instance)
			await (actions[ActionIdZoomISORouting.outputISOSetToNone] as any).callback(
				{ options: { output: 5 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/outputISO', [
				{ type: 'i', value: -2 },
				{ type: 'i', value: 5 },
			])
		})

		it('always sets to none even when a caller is selected', async () => {
			instance = createMockInstance({ selectedCallers: [1001] })
			const actions = GetActionsZoomISORouting(instance)
			await (actions[ActionIdZoomISORouting.outputISOSetToNone] as any).callback(
				{ options: { output: 1 } } as any,
				{} as any,
			)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/outputISO', [
				{ type: 'i', value: -2 },
				{ type: 'i', value: 1 },
			])
		})
	})
})
