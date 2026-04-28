import { describe, expect, it, jest } from '@jest/globals'
import { InstanceStatus } from '@companion-module/base'
import { handleSessionMessage } from '../../../src/osc/handlers/session.js'
import type { OSCHandlerContext, ZoomOSCResponse } from '../../../src/osc/types.js'
import { FeedbackId } from '../../../src/feedback.js'
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

	it('resets meeting state and checks explicit feedback ids when the meeting ends', () => {
		const context = createContext()
		context.instance.ZoomClientDataObj.numberOfGroups = 3
		context.instance.ZoomClientDataObj.last_response = 99
		context.instance.ZoomClientDataObj.subscribeMode = 2
		context.instance.ZoomClientDataObj.zoomOSCVersion = 'ZISO 3.0.0'
		context.instance.ZoomClientDataObj.engineState = 7
		context.instance.ZoomClientDataObj.capturePermissionGranted = true
		context.instance.ZoomClientDataObj.isPro = true
		context.instance.ZoomClientDataObj.selectedCallers = [1, 2]
		context.instance.ZoomVariableLink = [{ variableId: 'x' } as never]
		context.instance.ZoomUserData = { 1: { zoomId: 1, userName: 'Alice', users: [] } as never }
		const data: ZoomOSCResponse = {
			address: '/zoomosc/meetingStatus',
			args: [{ type: 'i', value: 0 }],
		}

		handleSessionMessage(context, data, 'meetingStatus')

		expect(context.destroyTimers).toHaveBeenCalled()
		expect(context.instance.ZoomVariableLink).toEqual([])
		expect(context.instance.ZoomClientDataObj.selectedCallers).toEqual([])
		expect(context.instance.ZoomGroupData).toHaveLength(5)
		expect(context.instance.ZoomGroupData[0]).toEqual({ groupName: 'Hosts', users: [] })
		expect(context.instance.checkFeedbacks).toHaveBeenCalledWith(
			FeedbackId.selectionMethod,
			FeedbackId.groupBased,
			FeedbackId.groupBasedAdvanced,
			FeedbackId.indexBased,
			FeedbackId.indexBasedAdvanced,
			FeedbackId.galleryBased,
			FeedbackId.galleryBasedAdvanced,
			FeedbackId.userNameBased,
			FeedbackId.userNameBasedAdvanced,
			FeedbackId.output,
			FeedbackId.audioOutput,
			FeedbackId.engineState,
			FeedbackId.capturePermissionGranted,
			FeedbackId.isPro,
		)
	})

	it('switches from ZISO to ZOSC and destroys the ISO puller when pong reports ZoomOSC', () => {
		const context = createContext()
		;(context.hasZoomIsoPuller as jest.Mock).mockReturnValue(true)
		context.instance.config.version = 1
		const data: ZoomOSCResponse = {
			address: '/zoomosc/pong',
			args: [
				{ type: 's', value: 'unused' },
				{ type: 's', value: 'ZOSC 2.0.0' },
				{ type: 'i', value: 2 },
				{ type: 'i', value: 1 },
				{ type: 'i', value: 1 },
				{ type: 'i', value: 4 },
				{ type: 'i', value: 10 },
				{ type: 'i', value: 1 },
			],
		}

		handleSessionMessage(context, data, 'pong')

		expect(context.destroyZoomIsoPullerTimer).toHaveBeenCalled()
		expect(context.instance.config.version).toBe(0)
		expect((context.instance.saveConfig as jest.Mock).mock.calls[0][0]).toBe(context.instance.config)
	})
})
