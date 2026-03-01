import { describe, it, expect } from '@jest/globals'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsUserView, ActionIdUserView } from '../../src/actions/action-user-view.js'

describe('GetActionsUserView', () => {
	// All view actions are global (/me/…) and require no user routing.

	describe('setGalleryView', () => {
		it('sends /zoom/me/setGalleryView with no args', () => {
			const instance = createMockInstance()
			const actions = GetActionsUserView(instance)
			;(actions[ActionIdUserView.setGalleryView] as any).callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/setGalleryView', [])
		})
	})

	describe('setSpeakerView', () => {
		it('sends /zoom/me/setSpeakerView with no args', () => {
			const instance = createMockInstance()
			const actions = GetActionsUserView(instance)
			;(actions[ActionIdUserView.setSpeakerView] as any).callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenCalledWith('/zoom/me/setSpeakerView', [])
		})
	})

	describe('gotoNextGalleryPage', () => {
		it('sends /zoom/me/galleryPageNext and then requests gallery order', () => {
			const instance = createMockInstance()
			const actions = GetActionsUserView(instance)
			;(actions[ActionIdUserView.gotoNextGalleryPage] as any).callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenNthCalledWith(1, '/zoom/me/galleryPageNext', [])
			expect(instance.OSC.sendCommand).toHaveBeenNthCalledWith(2, '/zoom/getGalleryOrder', [])
		})
	})

	describe('gotoPreviousGalleryPage', () => {
		it('sends /zoom/me/galleryPagePrev and then requests gallery order', () => {
			const instance = createMockInstance()
			const actions = GetActionsUserView(instance)
			;(actions[ActionIdUserView.gotoPreviousGalleryPage] as any).callback({} as any, {} as any)
			expect(instance.OSC.sendCommand).toHaveBeenNthCalledWith(1, '/zoom/me/galleryPagePrev', [])
			expect(instance.OSC.sendCommand).toHaveBeenNthCalledWith(2, '/zoom/getGalleryOrder', [])
		})
	})
})
