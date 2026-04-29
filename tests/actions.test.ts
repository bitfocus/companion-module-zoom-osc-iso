import { describe, expect, it } from '@jest/globals'
import { GetActions } from '../src/actions.js'
import { ActionIdGlobal } from '../src/actions/action-global.js'
import { ActionIdUsers } from '../src/actions/action-user.js'
import { ActionIdZoomISOEngine } from '../src/actions/action-zoomiso-engine.js'
import { createMockInstance } from './helpers/mock-instance.js'

describe('GetActions', () => {
	it('prefixes action names with their category names without changing ids', () => {
		const instance = createMockInstance()

		const actions = GetActions(instance)
		const muteAll = actions[ActionIdGlobal.muteAll]
		const selectionMethod = actions[ActionIdUsers.selectionMethod]
		const startIsoEngine = actions[ActionIdZoomISOEngine.startISOEngine]

		expect(muteAll).toBeTruthy()
		expect(selectionMethod).toBeTruthy()
		expect(startIsoEngine).toBeTruthy()
		if (!muteAll || !selectionMethod || !startIsoEngine) {
			throw new Error('Expected action definitions to exist')
		}

		expect(muteAll.name).toBe('Global: Mute All Except Host but Mute Co-Host')
		expect(selectionMethod.name).toBe('Users: Selection method')
		expect(startIsoEngine.name).toBe('ZoomISO Engine: Start ISO Engine')
		expect(Object.keys(actions)).toContain(ActionIdGlobal.muteAll)
		expect(Object.keys(actions)).toContain(ActionIdUsers.selectionMethod)
		expect(Object.keys(actions)).toContain(ActionIdZoomISOEngine.startISOEngine)
	})
})
