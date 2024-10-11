import { feedbackType } from '../feedback.js'

export interface oldActionToNewAction {
	[key: string]: {
		oldActionId: string
		newActionId: string
		type: string
		isGroupBased?: boolean
	}
}

export interface oldFeedbackToNewFeedback {
	[key: string]: {
		oldFeedbackId: string
		newFeedbackId: string
		isGroupBased?: boolean
	}
}

export interface oldFeedbackTypeToNewFeedbackType {
	[key: string]: {
		oldFeedbackId: string
		newFeedbackId: feedbackType
	}
}
