import { describe, it, expect, beforeEach } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import {
	GetActionsGlobalGalleryTrackingAndDataRequest,
	ActionIdGlobalGalleryTrackingAndDataRequest,
} from '../../src/actions/action-global-gallery-tracking-and-data-request.js'

describe('GetActionsGlobalGalleryTrackingAndDataRequest', () => {
	let instance: ReturnType<typeof createMockInstance>

	beforeEach(() => {
		instance = createMockInstance()
		;(instance.OSC.sendCommand as any).mockClear()
	})

	const cases: [ActionIdGlobalGalleryTrackingAndDataRequest, string][] = [
		[ActionIdGlobalGalleryTrackingAndDataRequest.requestOrderOfGalleryView, '/zoom/getGalleryOrder'],
		[ActionIdGlobalGalleryTrackingAndDataRequest.requestGalleryCount, '/zoom/galCount'],
		[ActionIdGlobalGalleryTrackingAndDataRequest.requestOrderOfSpotlights, '/zoom/getSpotOrder'],
	]

	it.each(cases)('%s sends %s with no args', async (actionId, expectedPath) => {
		const actions = GetActionsGlobalGalleryTrackingAndDataRequest(instance)
		await (actions[actionId] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith(expectedPath, [])
	})
})
