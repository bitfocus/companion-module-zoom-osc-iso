import { jest } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsUserView, ActionIdUserView } from '../../src/actions/action-user-view.js'

describe('GetActionsUserView', () => {
	let instance: ReturnType<typeof createMockInstance>
	let actions: ReturnType<typeof GetActionsUserView>

	beforeAll(() => {
		instance = createMockInstance()
		actions = GetActionsUserView(instance)
	})

	afterEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
		instance.ZoomClientDataObj.selectedCallers = []
	})

	// All view actions are global (/me/…) and require no user routing.

	describe('setGalleryView', () => {
		it('sends /zoom/me/setGalleryView with no args', () => {
			const callback = (actions[ActionIdUserView.setGalleryView] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/setGalleryView', [])
		})
	})

	describe('setSpeakerView', () => {
		it('sends /zoom/me/setSpeakerView with no args', () => {
			const callback = (actions[ActionIdUserView.setSpeakerView] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/setSpeakerView', [])
		})
	})

	describe('gotoNextGalleryPage', () => {
		it('sends /zoom/me/galleryPageNext and then requests gallery order', () => {
			const callback = (actions[ActionIdUserView.gotoNextGalleryPage] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenNthCalledWith(1, '/zoom/me/galleryPageNext', [])
			expect(instance.OSC.sendCommand).toHaveBeenNthCalledWith(2, '/zoom/getGalleryOrder', [])
		})
	})

	describe('gotoPreviousGalleryPage', () => {
		it('sends /zoom/me/galleryPagePrev and then requests gallery order', () => {
			const callback = (actions[ActionIdUserView.gotoPreviousGalleryPage] as any).callback
			callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenNthCalledWith(1, '/zoom/me/galleryPagePrev', [])
			expect(instance.OSC.sendCommand).toHaveBeenNthCalledWith(2, '/zoom/getGalleryOrder', [])
		})
	})
})
