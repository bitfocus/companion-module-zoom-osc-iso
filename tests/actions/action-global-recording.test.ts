import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsGlobalRecording, ActionIdGlobalRecording } from '../../src/actions/action-global-recording.js'

describe('GetActionsGlobalRecording', () => {
	let instance: ReturnType<typeof createMockInstance>
	let actions: ReturnType<typeof GetActionsGlobalRecording>

	beforeAll(() => {
		instance = createMockInstance()
		actions = GetActionsGlobalRecording(instance)
	})

	beforeEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
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
		await (actions[actionId] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith(expectedPath, [])
	})
})
