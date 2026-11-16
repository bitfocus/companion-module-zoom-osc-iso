import { describe, expect, it } from 'vitest'
import { createMockInstance } from '../helpers/mock-instance.js'
import { FeedbackId, feedbackType, GetFeedbacks } from '../../src/feedback.js'

function galleryFeedback(spotlighted: boolean | undefined, type: feedbackType): boolean {
	const instance = createMockInstance()
	instance.ZoomUserData[101] = { zoomId: 101, userName: 'Alice', users: [], spotlighted } as any
	instance.ZoomClientDataObj.galleryOrder = [101]
	const definition: any = GetFeedbacks(instance)[FeedbackId.galleryBased]
	return definition.callback({ options: { position: 1, type } })
}

describe('spotlight feedbacks', () => {
	it('reports Spotlight Off for a participant who has never been spotlighted', () => {
		expect(galleryFeedback(undefined, feedbackType.spotlightOff)).toBe(true)
		expect(galleryFeedback(undefined, feedbackType.spotlightOn)).toBe(false)
	})

	it('reports Spotlight On and Off from the tracked state', () => {
		expect(galleryFeedback(true, feedbackType.spotlightOn)).toBe(true)
		expect(galleryFeedback(true, feedbackType.spotlightOff)).toBe(false)
		expect(galleryFeedback(false, feedbackType.spotlightOn)).toBe(false)
		expect(galleryFeedback(false, feedbackType.spotlightOff)).toBe(true)
	})
})
