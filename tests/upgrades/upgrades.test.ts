import { describe, it, expect } from 'vitest'
import type { CompanionMigrationAction, CompanionMigrationFeedback } from '@companion-module/base'
import { UpgradeScripts } from '../../src/upgrades.js'
import { UpgradeV2ToV3 } from '../../src/upgrades/v2CommandsToUpgradeTov3.js'
import { fixWrongPinCommands } from '../../src/upgrades/fixWrongPinCommands.js'
import { addPollingConfigOptions } from '../../src/upgrades/addPollingConfigOptions.js'
import { addOscForwardingConfigFields } from '../../src/upgrades/addOscForwardingConfigFields.js'
import { addNewConfigFieldsForSocialStreamAndPerformanceTweaks } from '../../src/upgrades/addNewConfigFieldsForSocialStreamAndPerformanceTweaks.js'
import { addNewConfigFieldsForSocialStreamChatMessagesToSend } from '../../src/upgrades/addNewConfigFieldsForSocialStreamChatMessagesToSend.js'
import { ActionIdGroups } from '../../src/actions/action-group.js'
import { ActionIdUserSpotlight } from '../../src/actions/action-user-spotlight.js'
import { ActionIdUserPin } from '../../src/actions/action-user-pin.js'
import { FeedbackId, feedbackType } from '../../src/feedback.js'
import type { ZoomConfig } from '../../src/config.js'

const lit = <T>(value: T) => ({ isExpression: false as const, value })
const expr = (value: string) => ({ isExpression: true as const, value })

function action(actionId: string, options: CompanionMigrationAction['options']): CompanionMigrationAction {
	return { id: `a-${actionId}`, controlId: 'c1', actionId, options } as CompanionMigrationAction
}
function feedback(feedbackId: string, options: CompanionMigrationFeedback['options']): CompanionMigrationFeedback {
	return { id: `f-${feedbackId}`, controlId: 'c1', feedbackId, options } as CompanionMigrationFeedback
}
function props(actions: CompanionMigrationAction[], feedbacks: CompanionMigrationFeedback[] = []) {
	return { config: null, secrets: undefined, actions, feedbacks }
}
const context = { currentConfig: { host: '1.2.3.4' } as ZoomConfig }

describe('UpgradeScripts array', () => {
	it('keeps the historical order, including the duplicated UpgradeV2ToV3', () => {
		expect(UpgradeScripts).toEqual([
			UpgradeV2ToV3,
			UpgradeV2ToV3,
			addNewConfigFieldsForSocialStreamAndPerformanceTweaks,
			fixWrongPinCommands,
			addNewConfigFieldsForSocialStreamChatMessagesToSend,
			addPollingConfigOptions,
			addOscForwardingConfigFields,
		])
	})
})

describe('UpgradeV2ToV3 (wrapped v2 option values)', () => {
	it('maps a UserActions actionID option to the new action id', () => {
		const a = action('UserActions', { actionID: lit('Spotlight') })
		const out = UpgradeV2ToV3(context, props([a]))
		expect(out.updatedActions).toHaveLength(1)
		expect(out.updatedActions[0].actionId).toBe(ActionIdUserSpotlight.spotLight)
	})

	it('shifts a literal numeric group and renames groupOption set -> replace', () => {
		const a = action('addToGroup', { group: lit(1), groupOption: lit('set') })
		const out = UpgradeV2ToV3(context, props([a]))
		expect(out.updatedActions[0].actionId).toBe(ActionIdGroups.addToGroup)
		expect(out.updatedActions[0].options.group).toEqual(lit(2))
		expect(out.updatedActions[0].options.groupOption).toEqual(lit('replace'))
	})

	it('leaves a group expression untouched', () => {
		const a = action('addToGroup', { group: expr('$(local:group)'), groupOption: lit('add') })
		const out = UpgradeV2ToV3(context, props([a]))
		expect(out.updatedActions[0].options.group).toEqual(expr('$(local:group)'))
		expect(out.updatedActions[0].options.groupOption).toEqual(lit('add'))
	})

	it('does not touch unrelated actions', () => {
		const a = action(ActionIdUserPin.pin, { userName: lit('Bob') })
		const out = UpgradeV2ToV3(context, props([a]))
		expect(out.updatedActions).toEqual([])
	})

	it('renames feedbacks and shifts a literal group', () => {
		const f = feedback('groupBased', { group: lit(0), position: lit(1) })
		const out = UpgradeV2ToV3(context, props([], [f]))
		expect(out.updatedFeedbacks[0].feedbackId).toBe(FeedbackId.groupBased)
		expect(out.updatedFeedbacks[0].options.group).toEqual(lit(1))
	})

	it('converts a string feedback type to the numeric feedbackType', () => {
		const f = feedback(FeedbackId.indexBased, { position: lit(1), type: lit('micLive') })
		const out = UpgradeV2ToV3(context, props([], [f]))
		expect(out.updatedFeedbacks[0].options.type).toEqual(lit(feedbackType.micLive))
	})

	it('ignores a feedback type that is already numeric or an expression', () => {
		const f1 = feedback(FeedbackId.indexBased, { position: lit(1), type: lit(feedbackType.camera) })
		const f2 = feedback(FeedbackId.indexBased, { position: lit(1), type: expr('$(local:t)') })
		const out = UpgradeV2ToV3(context, props([], [f1, f2]))
		expect(out.updatedFeedbacks).toEqual([])
	})
})

describe('config-only upgrade scripts', () => {
	it('fixWrongPinCommands renames the old pin action ids (keyed by the map key)', () => {
		const a = action('AddPin', { userName: lit('') })
		const out = fixWrongPinCommands(context, props([a]))
		expect(out.updatedActions[0].actionId).toBe(ActionIdUserPin.addPin)
	})

	it('addPollingConfigOptions enables polling on top of the current config', () => {
		const out = addPollingConfigOptions(context, props([]))
		expect(out.updatedConfig).toMatchObject({
			host: '1.2.3.4',
			pollEngineState: true,
			pollAudioLevels: true,
			pollOutputRouting: true,
			pollAudioRouting: true,
		})
	})

	it('addNewConfigFieldsForSocialStreamChatMessagesToSend sets the default chat types', () => {
		const out = addNewConfigFieldsForSocialStreamChatMessagesToSend(context, props([]))
		expect(out.updatedConfig).toMatchObject({ host: '1.2.3.4', socialStreamChatTypeToSend: [0, 1, 2] })
	})

	it('addOscForwardingConfigFields adds forwarding turned off, pointed at the default address', () => {
		const out = addOscForwardingConfigFields(context, props([]))
		expect(out.updatedConfig).toMatchObject({
			host: '1.2.3.4',
			enableOscForwarding: false,
			oscForwardHost: '127.0.0.1',
			oscForwardPort: 1235,
		})
	})

	it('addOscForwardingConfigFields keeps forwarding settings that are already saved', () => {
		const saved = {
			currentConfig: { host: '1.2.3.4', enableOscForwarding: true, oscForwardHost: '10.0.0.5', oscForwardPort: 8000 },
		} as unknown as typeof context
		const out = addOscForwardingConfigFields(saved, props([]))
		expect(out.updatedConfig).toMatchObject({
			enableOscForwarding: true,
			oscForwardHost: '10.0.0.5',
			oscForwardPort: 8000,
		})
	})
})
