import { describe, expect, it, jest } from '@jest/globals'
import { handleSessionMessage } from '../../../src/osc/handlers/session.js'
import type { OSCHandlerContext, ZoomOSCResponse } from '../../../src/osc/types.js'
import { createMockInstance } from '../../helpers/mock-instance.js'

function createContext(): OSCHandlerContext {
	return {
		instance: createMockInstance(),
		createZoomUser: jest.fn(async () => undefined),
		setUpdateLoop: jest.fn(),
		setNeedToPingPong: jest.fn(),
		isSpotlightGroupTrackingInitialized: jest.fn(() => false),
		setSpotlightGroupTrackingInitialized: jest.fn(),
		destroyTimers: jest.fn(),
		createPingTimer: jest.fn(),
		createUpdatePresetsTimer: jest.fn(),
		createZoomIsoPullerTimer: jest.fn(),
		destroyZoomIsoPullerTimer: jest.fn(),
		hasZoomIsoPuller: jest.fn(() => false),
		configureConnectedPingWatchdog: jest.fn(),
		sendCommand: jest.fn(),
	}
}

describe('handleSessionMessage', () => {
	it('restores ping-pong monitoring before recreating timers when meeting status is in-call', () => {
		const context = createContext()
		const data: ZoomOSCResponse = {
			address: '/zoomosc/meetingStatus',
			args: [{ type: 'i', value: 3 }],
		}

		handleSessionMessage(context, data, 'meetingStatus')

		expect(context.setNeedToPingPong).toHaveBeenCalledWith(true)
		expect(context.createPingTimer).toHaveBeenCalled()
		expect(context.createUpdatePresetsTimer).toHaveBeenCalled()
		expect(context.createZoomIsoPullerTimer).toHaveBeenCalled()
	})
})
