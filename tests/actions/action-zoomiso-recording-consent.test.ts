import { describe, it, expect, beforeAll, beforeEach, type Mock } from 'vitest'
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
		const sendCommand = instance.OSC.sendCommand as Mock
		sendCommand.mockClear()
	})

	it('acceptRecordingConsent sends /zoom/acceptRecordingConsent with no args', () => {
		const action = actions[ActionIdZoomISORecordingConsent.acceptRecordingConsent] as any
		action.callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/acceptRecordingConsent', [])
	})
})
