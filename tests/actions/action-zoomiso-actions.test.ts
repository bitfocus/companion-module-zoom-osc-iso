import { describe, it, expect, beforeAll, afterEach } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import type { InstanceBaseExt } from '../../src/utils.js'
import type { ZoomConfig } from '../../src/config.js'

// jest.mock is hoisted before imports — feedback-state-machine is also
// stubbed via moduleNameMapper in jest.config.ts, but this mock provides
// specific FeedbackId values needed by action-zoomiso-actions assertions.
jest.mock('../../src/feedback.js', () => ({
	FeedbackId: {
		selectionMethod: 'selection_Method',
		groupBased: 'group_Based',
		groupBasedAdvanced: 'group_Based_Advanced',
		indexBased: 'index_Based',
		indexBasedAdvanced: 'index_Based_Advanced',
		galleryBased: 'gallery_Based',
		galleryBasedAdvanced: 'gallery_Based_Advanced',
		userNameBased: 'user_Name_Based',
		userNameBasedAdvanced: 'user_Name_Based_Advanced',
		output: 'output',
		audioOutput: 'audio_Output',
		engineState: 'engine_State',
		capturePermissionGranted: 'capture_permission_granted',
		isPro: 'is_pro',
	},
}))

import { GetActionsZoomISOActions, ActionIdZoomISOActions } from '../../src/actions/action-zoomiso-actions.js'

describe('GetActionsZoomISOActions', () => {
	let instance: InstanceBaseExt<ZoomConfig>
	let actions: ReturnType<typeof GetActionsZoomISOActions>

	beforeAll(() => {
		instance = createMockInstance()
		actions = GetActionsZoomISOActions(instance)
	})

	afterEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
	})

	describe(ActionIdZoomISOActions.selectOutput, () => {
		it('adds output to selectedOutputs when not present', async () => {
			await (actions[ActionIdZoomISOActions.selectOutput] as any).callback({ options: { output: 3 } } as any, {} as any)
			expect(instance.ZoomClientDataObj.selectedOutputs).toContain(3)
		})

		it('removes output from selectedOutputs when already present', async () => {
			instance.ZoomClientDataObj.selectedOutputs = [3]
			await (actions[ActionIdZoomISOActions.selectOutput] as any).callback({ options: { output: 3 } } as any, {} as any)
			expect(instance.ZoomClientDataObj.selectedOutputs).not.toContain(3)
		})

		it('calls checkFeedbacks', async () => {
			await (actions[ActionIdZoomISOActions.selectOutput] as any).callback({ options: { output: 1 } } as any, {} as any)
			expect(instance.checkFeedbacks).toHaveBeenCalled()
		})
	})

	describe(ActionIdZoomISOActions.clearSelectOutput, () => {
		it('clears selectedOutputs', async () => {
			instance.ZoomClientDataObj.selectedOutputs = [1, 2, 3]
			await (actions[ActionIdZoomISOActions.clearSelectOutput] as any).callback({} as any, {} as any)
			expect(instance.ZoomClientDataObj.selectedOutputs).toEqual([])
		})

		it('calls checkFeedbacks', async () => {
			await (actions[ActionIdZoomISOActions.clearSelectOutput] as any).callback({} as any, {} as any)
			expect(instance.checkFeedbacks).toHaveBeenCalled()
		})
	})

	describe(ActionIdZoomISOActions.selectAudioChannel, () => {
		it('adds audio channel to selectedAudioOutputs when not present', async () => {
			await (actions[ActionIdZoomISOActions.selectAudioChannel] as any).callback(
				{ options: { output: 2 } } as any,
				{} as any,
			)
			expect(instance.ZoomClientDataObj.selectedAudioOutputs).toContain(2)
		})

		it('removes audio channel from selectedAudioOutputs when already present', async () => {
			instance.ZoomClientDataObj.selectedAudioOutputs = [2]
			await (actions[ActionIdZoomISOActions.selectAudioChannel] as any).callback(
				{ options: { output: 2 } } as any,
				{} as any,
			)
			expect(instance.ZoomClientDataObj.selectedAudioOutputs).not.toContain(2)
		})

		it('calls checkFeedbacks', async () => {
			await (actions[ActionIdZoomISOActions.selectAudioChannel] as any).callback(
				{ options: { output: 1 } } as any,
				{} as any,
			)
			expect(instance.checkFeedbacks).toHaveBeenCalled()
		})
	})

	describe(ActionIdZoomISOActions.applyOutput, () => {
		it('sends /zoom/zoomID/outputISO with caller and output args', async () => {
			instance.ZoomClientDataObj.selectedCallers = [1001]
			instance.ZoomClientDataObj.selectedOutputs = [2]
			await (actions[ActionIdZoomISOActions.applyOutput] as any).callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/outputISO', [
				{ type: 'i', value: 1001 },
				{ type: 'i', value: 2 },
			])
		})

		it('does not send OSC when no caller is selected', async () => {
			instance.ZoomClientDataObj.selectedCallers = []
			instance.ZoomClientDataObj.selectedOutputs = [2]
			await (actions[ActionIdZoomISOActions.applyOutput] as any).callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).not.toHaveBeenCalled()
		})

		it('does not send OSC when no output is selected', async () => {
			instance.ZoomClientDataObj.selectedCallers = [1001]
			instance.ZoomClientDataObj.selectedOutputs = []
			await (actions[ActionIdZoomISOActions.applyOutput] as any).callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).not.toHaveBeenCalled()
		})
	})

	describe(ActionIdZoomISOActions.applyChannel, () => {
		it('sends /zoom/zoomID/audioISO with caller and output args', async () => {
			instance.ZoomClientDataObj.selectedCallers = [1001]
			instance.ZoomClientDataObj.selectedOutputs = [3]
			await (actions[ActionIdZoomISOActions.applyChannel] as any).callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/zoomID/audioISO', [
				{ type: 'i', value: 1001 },
				{ type: 'i', value: 3 },
			])
		})

		it('does not send OSC when no caller or output selected', async () => {
			instance.ZoomClientDataObj.selectedCallers = []
			instance.ZoomClientDataObj.selectedOutputs = []
			await (actions[ActionIdZoomISOActions.applyChannel] as any).callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).not.toHaveBeenCalled()
		})
	})

	describe(ActionIdZoomISOActions.applyOutputs, () => {
		it('sends /zoom/zoomID/outputISO for each matched caller/output pair', async () => {
			instance.ZoomClientDataObj.selectedCallers = [1001, 1002]
			instance.ZoomClientDataObj.selectedOutputs = [1, 2]
			await (actions[ActionIdZoomISOActions.applyOutputs] as any).callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledTimes(2)
			expect(instance.OSC.sendCommand).toHaveBeenNthCalledWith(1, '/zoom/zoomID/outputISO', [
				{ type: 'i', value: 1001 },
				{ type: 'i', value: 1 },
			])
			expect(instance.OSC.sendCommand).toHaveBeenNthCalledWith(2, '/zoom/zoomID/outputISO', [
				{ type: 'i', value: 1002 },
				{ type: 'i', value: 2 },
			])
		})

		it('does not send OSC when selectedOutputs is empty', async () => {
			instance.ZoomClientDataObj.selectedCallers = [1001]
			instance.ZoomClientDataObj.selectedOutputs = []
			await (actions[ActionIdZoomISOActions.applyOutputs] as any).callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).not.toHaveBeenCalled()
		})
	})
})
