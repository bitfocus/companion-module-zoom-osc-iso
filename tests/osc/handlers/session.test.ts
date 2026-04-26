import { describe, expect, it, jest } from '@jest/globals'
import { InstanceStatus } from '@companion-module/base'
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

	it.each([
		['v2 numeric isPro', 1, true],
		['v3 boolean isPro', true, true],
		['lite/essentials value', false, false],
	])('treats %s correctly in pong payload', (_label, rawIsPro, expectedIsPro) => {
		const context = createContext()
		const data: ZoomOSCResponse = {
			address: '/zoomosc/pong',
			args: [
				{ type: 's', value: 'unused' },
				{ type: 's', value: 'ZISO 3.0.0' },
				{ type: 'i', value: 2 },
				{ type: 'i', value: 1 },
				{ type: 'i', value: 1 },
				{ type: 'i', value: 4 },
				{ type: 'i', value: 10 },
				{ type: typeof rawIsPro === 'boolean' ? 'b' : 'i', value: rawIsPro },
			],
		}

		handleSessionMessage(context, data, 'pong')

		expect(context.instance.updateStatus).toHaveBeenCalledWith(InstanceStatus.Ok)
		expect(context.instance.ZoomClientDataObj.isPro).toBe(expectedIsPro)
		expect(context.instance.ZoomClientDataObj.zoomOSCVersion).toBe('ZISO 3.0.0')
	})
})
