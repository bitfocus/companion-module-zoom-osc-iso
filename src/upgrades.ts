import type {
	CompanionMigrationAction,
	CompanionMigrationFeedback,
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeResult,
	CompanionUpgradeContext,
} from '@companion-module/base'

import { ZoomConfig } from './config.js'
import { v2Actions, v2FeedbackTypes, v2Feedbacks } from './v2CommandsToUpgradeTov3.js'

export function UpgradeV2toV3(
	_context: CompanionUpgradeContext<ZoomConfig>,
	_props: CompanionStaticUpgradeProps<ZoomConfig>
): CompanionStaticUpgradeResult<ZoomConfig> {
	const result: CompanionStaticUpgradeResult<ZoomConfig> = {
		updatedActions: [],
		updatedConfig: null,
		updatedFeedbacks: [],
	}

	return result
}

export function UpgradeV2ToV3(
	_context: CompanionUpgradeContext<ZoomConfig>,
	props: CompanionStaticUpgradeProps<ZoomConfig>
): CompanionStaticUpgradeResult<ZoomConfig> {
	// let config: ZoomConfig = props.config;
	const actions: CompanionMigrationAction[] = props.actions
	const feedbacks: CompanionMigrationFeedback[] = props.feedbacks

	const result: CompanionStaticUpgradeResult<ZoomConfig> = {
		updatedActions: [],
		updatedConfig: null,
		updatedFeedbacks: [],
	}

	for (const action of actions) {
		if (
			(action.actionId === 'UserActions' ||
				action.actionId === 'GlobalActions' ||
				action.actionId === 'SpecialActions' ||
				action.actionId === 'ISOActions') &&
			action.options.actionID !== undefined &&
			Object.prototype.hasOwnProperty.call(v2Actions, action.options.actionID as string)
		) {
			const v2Action = v2Actions[action.options.actionID as string]
			action.actionId = v2Action.newActionId
			result.updatedActions.push(action)
		} else if (Object.prototype.hasOwnProperty.call(v2Actions, action.actionId)) {
			const v2Action = v2Actions[action.actionId]
			action.actionId = v2Action.newActionId

			if (typeof v2Action.isGroupBased !== 'undefined' && action.options.group !== undefined) {
				action.options.group = (action.options.group as number) + 1

				if (action.options.groupOption !== undefined && action.options.groupOption === 'set') {
					action.options.groupOption = 'replace'
				}
			}
			result.updatedActions.push(action)
		}
	}

	for (const feedback of feedbacks) {
		if (Object.prototype.hasOwnProperty.call(v2Feedbacks, feedback.feedbackId)) {
			const v2Feedback = v2Feedbacks[feedback.feedbackId]
			feedback.feedbackId = v2Feedback.newFeedbackId

			if (typeof v2Feedback.isGroupBased !== 'undefined' && feedback.options.group !== undefined) {
				feedback.options.group = (feedback.options.group as number) + 1
			}

			result.updatedFeedbacks.push(feedback)
		} else if (Object.prototype.hasOwnProperty.call(v2FeedbackTypes, feedback.options.type as string)) {
			const v2FeedbackType = v2FeedbackTypes[feedback.options.type as string]
			feedback.options.type = v2FeedbackType.newFeedbackId
			result.updatedFeedbacks.push(feedback)
		}
	}

	return result
}
