import { ActionIdUserPin } from '../actions/action-user-pin.js'
import { oldActionToNewAction } from './upgradeInterfaces.js'
import {
	CompanionUpgradeContext,
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeResult,
	CompanionMigrationAction,
} from '@companion-module/base'
import { ZoomConfig } from '../config.js'

export function fixWrongPinCommands(
	_context: CompanionUpgradeContext<ZoomConfig>,
	props: CompanionStaticUpgradeProps<ZoomConfig>,
): CompanionStaticUpgradeResult<ZoomConfig> {
	// let config: ZoomConfig = props.config;
	const actions: CompanionMigrationAction[] = props.actions

	const result: CompanionStaticUpgradeResult<ZoomConfig> = {
		updatedActions: [],
		updatedConfig: null,
		updatedFeedbacks: [],
	}

	const oldPinActionToNewActions: oldActionToNewAction = {
		AddPin: {
			oldActionId: 'add_Pin',
			newActionId: ActionIdUserPin.addPin,
			type: 'UserActions',
		},
		Unpin: {
			oldActionId: 'unpin',
			newActionId: ActionIdUserPin.unpin,
			type: 'UserActions',
		},
		PinScreen2: {
			oldActionId: 'pin_Screen2',
			newActionId: ActionIdUserPin.pin2,
			type: 'UserActions',
		},
		UnpinScreen2: {
			oldActionId: 'unPinScreen2',
			newActionId: ActionIdUserPin.unPin2,
			type: 'UserActions',
		},
		TogglePinScreen2: {
			oldActionId: 'togglePinScreen2',
			newActionId: ActionIdUserPin.togglePin2,
			type: 'UserActions',
		},
		ClearPins: {
			oldActionId: 'clear_pins',
			newActionId: ActionIdUserPin.clearPins,
			type: 'UserActions',
		},
		TogglePin: {
			oldActionId: 'toggle_pin',
			newActionId: ActionIdUserPin.togglePin,
			type: 'UserActions',
		},
	}
	for (const action of actions) {
		if (Object.prototype.hasOwnProperty.call(oldPinActionToNewActions, action.actionId)) {
			const oldActionToNewAction = oldPinActionToNewActions[action.actionId]
			action.actionId = oldActionToNewAction.newActionId

			result.updatedActions.push(action)
		}
	}

	return result
}
