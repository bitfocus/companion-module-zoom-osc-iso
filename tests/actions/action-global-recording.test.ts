import { describe, it, expect, beforeEach } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsGlobalRecording, ActionIdGlobalRecording } from '../../src/actions/action-global-recording.js'

describe('GetActionsGlobalRecording', () => {
	let instance: ReturnType<typeof createMockInstance>

	beforeEach(() => {
		instance = createMockInstance()
		;(instance.OSC.sendCommand as any).mockClear()
	})

	const cases: [ActionIdGlobalRecording, string][] = [
		[ActionIdGlobalRecording.startLocalRecording, '/zoom/startLocalRecording'],
		[ActionIdGlobalRecording.pauseLocalRecording, '/zoom/pauseLocalRecording'],
		[ActionIdGlobalRecording.resumeLocalRecording, '/zoom/resumeLocalRecording'],
		[ActionIdGlobalRecording.stopLocalRecording, '/zoom/stopLocalRecording'],
		[ActionIdGlobalRecording.startCloudRecording, '/zoom/startCloudRecording'],
		[ActionIdGlobalRecording.pauseCloudRecording, '/zoom/pauseCloudRecording'],
		[ActionIdGlobalRecording.resumeCloudRecording, '/zoom/resumeCloudRecording'],
		[ActionIdGlobalRecording.stopCloudRecording, '/zoom/stopCloudRecording'],
	]

	it.each(cases)('%s sends %s with no args', async (actionId, expectedPath) => {
		const actions = GetActionsGlobalRecording(instance)
		await (actions[actionId] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith(expectedPath, [])
	})
})
