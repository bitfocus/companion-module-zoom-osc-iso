import { describe, expect, it, vi } from 'vitest'
import { handleGalleryMessage } from '../../../src/osc/handlers/gallery.js'
import type { OSCHandlerContext, ZoomOSCResponse } from '../../../src/osc/types.js'
import { createMockInstance } from '../../helpers/mock-instance.js'

function createContext(): OSCHandlerContext {
	const instance = createMockInstance()
	instance.ZoomGroupData = [
		{ groupName: 'Hosts', users: [] },
		{ groupName: 'Spotlights', users: [] },
	]
	for (const [zoomId, userName] of [
		[101, 'Alice'],
		[102, 'Bob'],
		[103, 'Carol'],
	] as const) {
		instance.ZoomUserData[zoomId] = { zoomId, userName, users: [] } as any
		instance.ZoomVariableLink.push({ zoomId, userName })
	}
	instance.updateDefinitionsForActionsFeedbacksAndPresets = vi.fn()

	return {
		instance,
		createZoomUser: vi.fn(async () => undefined),
		setUpdateLoop: vi.fn(),
		setNeedToPingPong: vi.fn(),
		isSpotlightGroupTrackingInitialized: vi.fn(() => true),
		setSpotlightGroupTrackingInitialized: vi.fn(),
		destroyTimers: vi.fn(),
		createPingTimer: vi.fn(),
		createUpdatePresetsTimer: vi.fn(),
		createZoomIsoPullerTimer: vi.fn(),
		destroyZoomIsoPullerTimer: vi.fn(),
		hasZoomIsoPuller: vi.fn(() => false),
		configureConnectedPingWatchdog: vi.fn(),
		sendCommand: vi.fn(),
	}
}

const spotOrder = (...zoomIds: number[]): ZoomOSCResponse => ({
	address: '/zoomosc/me/spotOrder',
	args: zoomIds.map((value) => ({ type: 'i', value })),
})

describe('spot order', () => {
	it('marks the listed participants as spotlighted', () => {
		const context = createContext()
		handleGalleryMessage(context, spotOrder(101, 102), 'spotOrder')

		expect(context.instance.ZoomUserData[101].spotlighted).toBe(true)
		expect(context.instance.ZoomUserData[102].spotlighted).toBe(true)
		expect(context.instance.ZoomGroupData[1].users.map((u) => u.zoomID)).toEqual([101, 102])
	})

	it('clears participants who dropped out of the spot order', () => {
		const context = createContext()
		handleGalleryMessage(context, spotOrder(101, 102), 'spotOrder')
		handleGalleryMessage(context, spotOrder(102), 'spotOrder')

		expect(context.instance.ZoomUserData[101].spotlighted).toBe(false)
		expect(context.instance.ZoomUserData[102].spotlighted).toBe(true)
	})

	it('only touches participants who were in the Spotlights group, not the whole meeting', () => {
		const context = createContext()
		handleGalleryMessage(context, spotOrder(101), 'spotOrder')
		handleGalleryMessage(context, spotOrder(102), 'spotOrder')

		// Carol was never spotlighted, so the update leaves her untouched
		expect(context.instance.ZoomUserData[103].spotlighted).toBeUndefined()
	})

	it('updates the buttons when the spot order only removes people', () => {
		const context = createContext()
		handleGalleryMessage(context, spotOrder(101), 'spotOrder')
		vi.mocked(context.instance.checkFeedbacks).mockClear()

		handleGalleryMessage(context, spotOrder(), 'spotOrder')

		expect(context.instance.ZoomUserData[101].spotlighted).toBe(false)
		expect(context.instance.ZoomGroupData[1].users).toEqual([])
		expect(context.instance.checkFeedbacks).toHaveBeenCalled()
	})
})
