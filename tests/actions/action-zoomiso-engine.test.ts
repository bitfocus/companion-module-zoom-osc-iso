import { jest } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsZoomISOEngine, ActionIdZoomISOEngine } from '../../src/actions/action-zoomiso-engine.js'
import type { InstanceBaseExt } from '../../src/utils.js'
import type { ZoomConfig } from '../../src/config.js'

describe('GetActionsZoomISOEngine', () => {
	let instance: InstanceBaseExt<ZoomConfig>
	let actions: ReturnType<typeof GetActionsZoomISOEngine>

	beforeAll(() => {
		instance = createMockInstance()
		actions = GetActionsZoomISOEngine(instance)
	})

	afterEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
	})

	it(`${ActionIdZoomISOEngine.startISOEngine} sends /zoom/startISOEngine`, async () => {
		await (actions[ActionIdZoomISOEngine.startISOEngine] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/startISOEngine', [])
	})

	it(`${ActionIdZoomISOEngine.stopISOEngine} sends /zoom/stopISOEngine`, async () => {
		await (actions[ActionIdZoomISOEngine.stopISOEngine] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/stopISOEngine', [])
	})

	it(`${ActionIdZoomISOEngine.standbyISOEngine} sends /zoom/standbyISOEngine`, async () => {
		await (actions[ActionIdZoomISOEngine.standbyISOEngine] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/standbyISOEngine', [])
	})

	it(`${ActionIdZoomISOEngine.requestCapturePermission} sends /zoom/requestCapturePermission`, async () => {
		await (actions[ActionIdZoomISOEngine.requestCapturePermission] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/requestCapturePermission', [])
	})

	it('engine commands are global (ignore selected callers)', async () => {
		instance = createMockInstance({ selectedCallers: [1001] })
		const actions = GetActionsZoomISOEngine(instance)
		await (actions[ActionIdZoomISOEngine.startISOEngine] as any).callback({} as any, {} as any)
		expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/startISOEngine', [])
	})
})
