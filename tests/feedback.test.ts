import { describe, expect, it } from '@jest/globals'
import { FeedbackId, GetFeedbacks } from '../src/feedback.js'
import { createMockInstance } from './helpers/mock-instance.js'

describe('GetFeedbacks', () => {
	it('prefixes feedback names with their category names without changing ids', () => {
		const instance = createMockInstance()

		const feedbacks = GetFeedbacks(instance)
		const selectionMethod = feedbacks[FeedbackId.selectionMethod]
		const groupBased = feedbacks[FeedbackId.groupBased]
		const engineState = feedbacks[FeedbackId.engineState]
		const output = feedbacks[FeedbackId.output]

		expect(selectionMethod).toBeTruthy()
		expect(groupBased).toBeTruthy()
		expect(engineState).toBeTruthy()
		expect(output).toBeTruthy()
		if (!selectionMethod || !groupBased || !engineState || !output) {
			throw new Error('Expected feedback definitions to exist')
		}

		expect(selectionMethod.name).toBe('Users: selection method')
		expect(groupBased.name).toBe('Groups: Group based feedback')
		expect(engineState.name).toBe('ZoomISO Engine: Status of the engine feedback')
		expect(output.name).toBe('ZoomISO Output Settings: Selected output feedback')
		expect(Object.keys(feedbacks)).toContain(FeedbackId.selectionMethod)
		expect(Object.keys(feedbacks)).toContain(FeedbackId.groupBased)
		expect(Object.keys(feedbacks)).toContain(FeedbackId.engineState)
		expect(Object.keys(feedbacks)).toContain(FeedbackId.output)
	})
})
