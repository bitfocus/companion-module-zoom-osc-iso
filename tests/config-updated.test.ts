import { describe, expect, it, vi } from 'vitest'
import ZoomInstance from '../src/index.js'
import { OSC } from '../src/osc.js'
import { createMockInstance } from './helpers/mock-instance.js'

vi.mock('../src/osc.js', () => ({
	OSC: vi.fn(function (this: Record<string, unknown>) {
		this.destroy = vi.fn(async () => {})
		this.updateForwarding = vi.fn()
	}),
}))

/** The instance's own configUpdated, on a stand-in with the settings saved before */
function setup() {
	const config = structuredClone(createMockInstance().config)
	const groups = [
		{ groupName: 'Hosts', users: [{ zoomID: 101, userName: 'Alice' }] },
		{ groupName: 'Spotlights', users: [] },
		{ groupName: 'Speakers', users: [{ zoomID: 102, userName: 'Bob' }] },
	]
	const osc = { destroy: vi.fn(async () => {}), updateForwarding: vi.fn() }
	const self: any = {
		config,
		OSC: osc,
		ZoomGroupData: groups,
		ZoomClientDataObj: { numberOfGroups: 1 },
		saveConfig: vi.fn(),
		log: vi.fn(),
		updateInstance: vi.fn(),
	}
	const configUpdated = async (next: typeof config) => ZoomInstance.prototype.configUpdated.call(self, next)
	return { self, config, osc, groups, configUpdated }
}

describe('ZoomInstance configUpdated', () => {
	it('applies a change to only the OSC forwarding settings without reconnecting or resetting the groups', async () => {
		const { self, config, osc, groups, configUpdated } = setup()
		const next = { ...config, enableOscForwarding: true, oscForwardHost: '192.168.1.20', oscForwardPort: 8000 }

		await configUpdated(next)

		expect(self.config).toBe(next)
		expect(self.saveConfig).toHaveBeenCalledWith(next)
		expect(osc.updateForwarding).toHaveBeenCalledTimes(1)
		expect(osc.destroy).not.toHaveBeenCalled()
		expect(self.OSC).toBe(osc)
		expect(self.ZoomGroupData).toBe(groups)
		expect(groups[2]).toEqual({ groupName: 'Speakers', users: [{ zoomID: 102, userName: 'Bob' }] })
		expect(vi.mocked(OSC)).not.toHaveBeenCalled()
	})

	it('reconnects as before when anything else changed', async () => {
		const { self, config, osc, configUpdated } = setup()

		await configUpdated({ ...config, enableOscForwarding: true, host: '10.0.0.9' })

		expect(osc.destroy).toHaveBeenCalledTimes(1)
		expect(osc.updateForwarding).not.toHaveBeenCalled()
		expect(self.OSC).not.toBe(osc)
		expect(self.updateInstance).toHaveBeenCalled()
	})
})
