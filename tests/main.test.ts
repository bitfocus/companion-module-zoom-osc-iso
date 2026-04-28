import { beforeEach, describe, expect, it, jest } from '@jest/globals'

const mockSaveConfig = jest.fn()
const mockLog = jest.fn()
const mockSetActionDefinitions = jest.fn()
const mockSetFeedbackDefinitions = jest.fn()
const mockSetPresetDefinitions = jest.fn()

const mockGetActions = jest.fn(() => ({ actionOne: { name: 'Action One' } }))
const configFields = [{ id: 'host', type: 'textinput', label: 'Host' }]
const mockGetConfigFields = jest.fn(() => configFields)
const mockGetFeedbacks = jest.fn(() => ({ feedbackOne: { type: 'boolean', options: [] } }))
const actionDefinitions = { actionOne: { name: 'Action One' } }
const feedbackDefinitions = { feedbackOne: { type: 'boolean', options: [] } }
const presetList = { structure: [{ id: 'folder', type: 'folder' }], presets: { presetOne: {} } }
mockGetActions.mockImplementation(() => actionDefinitions)
mockGetFeedbacks.mockImplementation(() => feedbackDefinitions)
const mockGetPresetList = jest.fn(() => presetList)
const mockInitVariableDefinitions = jest.fn()
const mockUpdateVariableValues = jest.fn()

const mockOscDestroy = jest.fn(async () => undefined)
const mockOscCtor = jest.fn().mockImplementation(() => ({
	destroy: mockOscDestroy,
}))

const mockUpgradeV2ToV3 = jest.fn()
const mockAddSocialStreamTweaks = jest.fn()
const mockFixWrongPinCommands = jest.fn()
const mockAddSocialStreamChatTypes = jest.fn()
const mockAddPollingConfigOptions = jest.fn()

class MockInstanceBase {
	public instanceOptions = { disableVariableValidation: false }
	public id = 'test-instance'
	public saveConfig = mockSaveConfig
	public log = mockLog
	public setActionDefinitions = mockSetActionDefinitions
	public setFeedbackDefinitions = mockSetFeedbackDefinitions
	public setPresetDefinitions = mockSetPresetDefinitions

	constructor(_internal: unknown) {}
}

jest.unstable_mockModule('@companion-module/base', () => ({
	InstanceBase: MockInstanceBase,
}))

jest.unstable_mockModule('../src/actions.js', () => ({
	GetActions: mockGetActions,
}))

jest.unstable_mockModule('../src/config.js', () => ({
	GetConfigFields: mockGetConfigFields,
}))

jest.unstable_mockModule('../src/feedback.js', () => ({
	GetFeedbacks: mockGetFeedbacks,
}))

jest.unstable_mockModule('../src/presets.js', () => ({
	GetPresetList: mockGetPresetList,
}))

jest.unstable_mockModule('../src/osc.js', () => ({
	OSC: mockOscCtor,
}))

jest.unstable_mockModule('../src/variables/variable-values.js', () => ({
	updateVariableValues: mockUpdateVariableValues,
}))

jest.unstable_mockModule('../src/variables/variable-definitions.js', () => ({
	initVariableDefinitions: mockInitVariableDefinitions,
}))

jest.unstable_mockModule('../src/upgrades/v2CommandsToUpgradeTov3.js', () => ({
	UpgradeV2ToV3: mockUpgradeV2ToV3,
}))

jest.unstable_mockModule('../src/upgrades/addNewConfigFieldsForSocialStreamAndPerformanceTweaks.js', () => ({
	addNewConfigFieldsForSocialStreamAndPerformanceTweaks: mockAddSocialStreamTweaks,
}))

jest.unstable_mockModule('../src/upgrades/fixWrongPinCommands.js', () => ({
	fixWrongPinCommands: mockFixWrongPinCommands,
}))

jest.unstable_mockModule('../src/upgrades/addNewConfigFieldsForSocialStreamChatMessagesToSend.js', () => ({
	addNewConfigFieldsForSocialStreamChatMessagesToSend: mockAddSocialStreamChatTypes,
}))

jest.unstable_mockModule('../src/upgrades/addPollingConfigOptions.js', () => ({
	addPollingConfigOptions: mockAddPollingConfigOptions,
}))

const { default: ZoomInstance, UpgradeScripts } = await import('../src/main.js')

describe('ZoomInstance', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('exports the expected upgrade scripts in order', () => {
		expect(UpgradeScripts).toEqual([
			mockUpgradeV2ToV3,
			mockAddSocialStreamTweaks,
			mockFixWrongPinCommands,
			mockAddSocialStreamChatTypes,
			mockAddPollingConfigOptions,
		])
	})

	it('disables variable validation in the constructor', () => {
		const instance = new ZoomInstance({})

		expect(instance.instanceOptions.disableVariableValidation).toBe(true)
	})

	it('rebuilds config state, recreates OSC, and updates definitions', async () => {
		const instance = new ZoomInstance({})
		const previousOscDestroy = jest.fn(async () => undefined)
		instance.OSC = { destroy: previousOscDestroy } as unknown as typeof instance.OSC

		const config = {
			...instance.config,
			numberOfGroups: 3,
			enableActionPresetAndFeedbackSync: true,
		}

		await instance.configUpdated(config)

		expect(mockSaveConfig).toHaveBeenCalledWith(config)
		expect(mockLog).toHaveBeenCalledWith('info', 'changing config!')
		expect(previousOscDestroy).toHaveBeenCalled()
		expect(mockOscCtor).toHaveBeenCalledWith(instance)
		expect(instance.ZoomClientDataObj.numberOfGroups).toBe(3)
		expect(instance.ZoomGroupData).toHaveLength(5)
		expect(instance.ZoomGroupData[0]).toEqual({ groupName: 'Hosts', users: [] })
		expect(instance.ZoomGroupData[1]).toEqual({ groupName: 'Spotlights', users: [] })
		expect(instance.ZoomGroupData[2]).toEqual({ groupName: 'Group 2', users: [] })
		expect(mockInitVariableDefinitions).toHaveBeenCalledWith(instance)
		expect(mockUpdateVariableValues).toHaveBeenCalledWith(instance)
		expect(mockSetActionDefinitions).toHaveBeenCalledWith(actionDefinitions)
		expect(mockSetFeedbackDefinitions).toHaveBeenCalledWith(feedbackDefinitions)
		expect(mockSetPresetDefinitions).toHaveBeenCalledWith(presetList.structure, presetList.presets)
	})

	it('returns config fields from the config module', () => {
		const instance = new ZoomInstance({})

		expect(instance.getConfigFields()).toEqual(configFields)
	})

	it('logs and delegates init to configUpdated', async () => {
		const instance = new ZoomInstance({})
		const configUpdatedSpy = jest.spyOn(instance, 'configUpdated').mockResolvedValue(undefined)

		await instance.init(instance.config)

		expect(mockLog).toHaveBeenCalledWith('info', 'Welcome, Zoom module is being initialized')
		expect(configUpdatedSpy).toHaveBeenCalledTimes(1)
		expect(configUpdatedSpy.mock.calls[0][0]).toBe(instance.config)
	})

	it('resets runtime state and destroys OSC on destroy', async () => {
		const instance = new ZoomInstance({})
		instance.ZoomUserData = { 1: { zoomId: 1, userName: 'Alice', targetIndex: 0, galleryIndex: 0, users: [] } }
		instance.ZoomVariableLink = [{ name: 'a', id: 1 } as never]
		instance.ZoomGroupData = [{ groupName: 'Hosts', users: [] }]
		instance.ZoomUserOffline = { 1: true } as never
		instance.ZoomMeData = { zoomId: 99, userName: 'Me' }
		instance.ZoomAudioLevelData = { 1: { zoomId: 1, audioLevel: 5 } } as never
		instance.ZoomAudioRoutingData = { 1: { zoomId: 1, inputMuted: false, outputMuted: false } } as never
		const destroySpy = jest.fn(async () => undefined)
		instance.OSC = { destroy: destroySpy } as unknown as typeof instance.OSC

		await instance.destroy()

		expect(instance.ZoomUserData).toEqual({})
		expect(instance.ZoomVariableLink).toEqual([])
		expect(instance.ZoomGroupData).toEqual([])
		expect(instance.ZoomUserOffline).toEqual([])
		expect(instance.ZoomMeData).toEqual({ zoomId: 0, userName: '' })
		expect(instance.ZoomAudioLevelData).toEqual([])
		expect(instance.ZoomAudioRoutingData).toEqual([])
		expect(mockLog).toHaveBeenCalledWith('debug', 'Instance destroyed: test-instance')
		expect(destroySpy).toHaveBeenCalled()
	})
})
