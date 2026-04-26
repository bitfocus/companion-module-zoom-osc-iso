import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import {
	GetActionsGlobalGalleryTrackingAndDataRequest,
	ActionIdGlobalGalleryTrackingAndDataRequest,
} from '../../src/actions/action-global-gallery-tracking-and-data-request.js'

describe('GetActionsGlobalGalleryTrackingAndDataRequest', () => {
	let instance: ReturnType<typeof createMockInstance>
	let actions: ReturnType<typeof GetActionsGlobalGalleryTrackingAndDataRequest>

	beforeAll(() => {
		instance = createMockInstance()
		actions = GetActionsGlobalGalleryTrackingAndDataRequest(instance)
	})

	beforeEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
	})

	const cases: [ActionIdGlobalGalleryTrackingAndDataRequest, string][] = [
		[ActionIdGlobalGalleryTrackingAndDataRequest.requestOrderOfGalleryView, '/zoom/getGalleryOrder'],
		[ActionIdGlobalGalleryTrackingAndDataRequest.requestGalleryCount, '/zoom/galCount'],
		[ActionIdGlobalGalleryTrackingAndDataRequest.requestOrderOfSpotlights, '/zoom/getSpotOrder'],
	]

	it.each(cases)('%s sends %s with no args', async (actionId, expectedPath) => {
		await (actions[actionId] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith(expectedPath, [])
	})
})
