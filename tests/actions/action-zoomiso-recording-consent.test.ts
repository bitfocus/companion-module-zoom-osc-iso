import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import {
	GetActionsZoomISORecordingConsent,
	ActionIdZoomISORecordingConsent,
} from '../../src/actions/action-zoomiso-recording-consent.js'

describe('GetActionsZoomISORecordingConsent', () => {
	let instance: ReturnType<typeof createMockInstance>
	let actions: ReturnType<typeof GetActionsZoomISORecordingConsent>

	beforeAll(() => {
		instance = createMockInstance()
		actions = GetActionsZoomISORecordingConsent(instance)
	})

	beforeEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
	})

	it('acceptRecordingConsent sends /zoom/acceptRecordingConsent with no args', () => {
		const action = actions[ActionIdZoomISORecordingConsent.acceptRecordingConsent] as any
		action.callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/acceptRecordingConsent', [])
	})
})
