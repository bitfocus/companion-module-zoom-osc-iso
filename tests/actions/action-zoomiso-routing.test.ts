import { describe, it, expect, beforeEach, afterEach, type Mock } from 'vitest'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsZoomISORouting, ActionIdZoomISORouting } from '../../src/actions/action-zoomiso-routing.js'

describe('GetActionsZoomISORouting', () => {
	let instance: ReturnType<typeof createMockInstance>
	let actions: ReturnType<typeof GetActionsZoomISORouting>

	beforeEach(() => {
		instance = createMockInstance()
		actions = GetActionsZoomISORouting(instance)
	})

	afterEach(() => {
		const sendCommand = instance.OSC.sendCommand as Mock
		sendCommand.mockClear()
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

	// known issue 7: ZoomOSC 5+ and ZoomISO 3+ no longer clear an output with -2, Zoom ID 1 does
	describe('setting an output to none, by the version the pong reports', () => {
		const setToNone = async (version: string, selectedCallers: number[] = []) => {
			const instance = createMockInstance({ selectedCallers })
			instance.ZoomClientDataObj.zoomOSCVersion = version
			const actions = GetActionsZoomISORouting(instance)
			await (actions[ActionIdZoomISORouting.outputISO] as any).callback(
				{ options: { userName: '', output: 3, setToNoneIfNotUserSelected: true } } as any,
				{} as any,
			)
			await (actions[ActionIdZoomISORouting.outputISOSetToNone] as any).callback(
				{ options: { output: 4 } } as any,
				{} as any,
			)
			return (instance.OSC.sendCommand as Mock).mock.calls
		}

		it.each(['ZOSC_5.0.1_MAC', 'ZOSC_5.0.0_MAC', 'ZISO_3.0.7_MAC'])('sends Zoom ID 1 on %s', async (version) => {
			expect(await setToNone(version)).toEqual([
				[
					'/zoom/zoomID/outputISO',
					[
						{ type: 'i', value: 1 },
						{ type: 'i', value: 3 },
					],
				],
				[
					'/zoom/zoomID/outputISO',
					[
						{ type: 'i', value: 1 },
						{ type: 'i', value: 4 },
					],
				],
			])
		})

		it.each(['ZOSC_4.6.1_MAC', 'ZISO_2.4.1_pro_MAC', 'Not Connected'])('still sends -2 on %s', async (version) => {
			const calls = await setToNone(version)
			expect(calls.map(([, args]) => args[0].value)).toEqual([-2, -2])
		})

		it('routes a selected participant as before, whatever the version', async () => {
			const calls = await setToNone('ZISO_3.0.7_MAC', [1001])
			expect(calls[0]).toEqual([
				'/zoom/zoomID/outputISO',
				[
					{ type: 'i', value: 1001 },
					{ type: 'i', value: 3 },
				],
			])
		})
	})
})
