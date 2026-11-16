import { describe, expect, it } from 'vitest'
import { createMockInstance } from '../helpers/mock-instance.js'
import { FeedbackId, feedbackType, GetFeedbacks } from '../../src/feedback.js'

function groupFeedback(id: FeedbackId.groupBased | FeedbackId.groupBasedAdvanced, groups: any[], group: string) {
	const instance = createMockInstance()
	instance.ZoomUserData[101] = { zoomId: 101, userName: 'Alice', users: [] } as any
	instance.ZoomGroupData = groups
	const definition: any = GetFeedbacks(instance)[id]
	return definition.callback({ options: { group, position: 1, type: feedbackType.selected } })
}

describe('group feedbacks', () => {
	const groups = [
		{ groupName: 'Hosts', users: [] },
		{ groupName: 'Spotlights', users: [{ zoomID: 101, userName: 'Alice' }] },
	]

	it.each([
		['a group that does not exist', groups, '4'],
		['no groups at all', [], '1'],
		['an empty position', groups, '0'],
	])('show nothing for %s, without throwing', (_case, data, group) => {
		expect(groupFeedback(FeedbackId.groupBased, data, group)).toBe(false)
		expect(groupFeedback(FeedbackId.groupBasedAdvanced, data, group)).toEqual({})
	})
})
