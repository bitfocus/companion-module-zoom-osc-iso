import { describe, it, expect, beforeAll, beforeEach, afterEach } from '@jest/globals'
import type { InstanceBaseExt } from '../../src/utils.js'
import type { ZoomConfig } from '../../src/config.js'
import { createMockInstance } from '../helpers/mock-instance.js'
import { GetActionsGallery, ActionIdGallery } from '../../src/actions/action-gallery.js'

describe('GetActionsGallery', () => {
	let instance: InstanceBaseExt<ZoomConfig>
	let actions: ReturnType<typeof GetActionsGallery>

	beforeAll(() => {
		instance = createMockInstance({ selectedCallers: [] })
		actions = GetActionsGallery(instance)
	})

	beforeEach(() => {
		instance.ZoomClientDataObj.galleryOrder = [1001, 1002, 1003]
		instance.ZoomClientDataObj.selectedCallers = []
	})

	afterEach(() => {
		const sendCommand = instance.OSC.sendCommand as jest.Mock
		sendCommand.mockClear()
	})

	describe('selectFromGalleryPosition', () => {
		it('selects user at gallery position 1 with select option', () => {
			const callback = (actions[ActionIdGallery.selectFromGalleryPosition] as any).callback
			callback({ options: { position: 1, option: 'select' } } as any, {} as any)
			expect(instance.ZoomClientDataObj.selectedCallers).toContain(1001)
		})

		it('selects user at gallery position 2 with select option', () => {
			const callback = (actions[ActionIdGallery.selectFromGalleryPosition] as any).callback
			callback({ options: { position: 2, option: 'select' } } as any, {} as any)
			expect(instance.ZoomClientDataObj.selectedCallers).toContain(1002)
		})

		it('removes user at gallery position 1 with remove option', () => {
			instance.ZoomClientDataObj.selectedCallers = [1001]
			const callback = (actions[ActionIdGallery.selectFromGalleryPosition] as any).callback
			callback({ options: { position: 1, option: 'remove' } } as any, {} as any)
			expect(instance.ZoomClientDataObj.selectedCallers).not.toContain(1001)
		})

		it('toggles selection off when user is already selected (single mode)', () => {
			instance.config.selectionMethod = 1 // single selection mode
			instance.ZoomClientDataObj.selectedCallers = [1001]
			const callback = (actions[ActionIdGallery.selectFromGalleryPosition] as any).callback
			callback({ options: { position: 1, option: 'toggle' } } as any, {} as any)
			expect(instance.ZoomClientDataObj.selectedCallers).not.toContain(1001)
		})

		it('saves previous selection before selecting', () => {
			instance.ZoomClientDataObj.selectedCallers = [9999]
			const callback = (actions[ActionIdGallery.selectFromGalleryPosition] as any).callback
			callback({ options: { position: 1, option: 'select' } } as any, {} as any)
			expect(instance.ZoomClientDataObj.PreviousSelectedCallers).toContain(9999)
		})

		it('calls checkFeedbacks after selection', () => {
			const callback = (actions[ActionIdGallery.selectFromGalleryPosition] as any).callback
			callback({ options: { position: 1, option: 'select' } } as any, {} as any)
			expect(instance.checkFeedbacks).toHaveBeenCalled()
		})

		it('calls setVariableValues after selection', () => {
			const callback = (actions[ActionIdGallery.selectFromGalleryPosition] as any).callback
			callback({ options: { position: 1, option: 'select' } } as any, {} as any)
			expect(instance.setVariableValues).toHaveBeenCalled()
		})
	})
})
