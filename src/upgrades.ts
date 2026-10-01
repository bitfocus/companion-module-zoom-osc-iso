import type { CompanionStaticUpgradeScript } from '@companion-module/base'
import type { ZoomConfig } from './config.js'
import { addNewConfigFieldsForSocialStreamAndPerformanceTweaks } from './upgrades/addNewConfigFieldsForSocialStreamAndPerformanceTweaks.js'
import { UpgradeV2ToV3 } from './upgrades/v2CommandsToUpgradeTov3.js'
import { fixWrongPinCommands } from './upgrades/fixWrongPinCommands.js'
import { addNewConfigFieldsForSocialStreamChatMessagesToSend } from './upgrades/addNewConfigFieldsForSocialStreamChatMessagesToSend.js'
import { addPollingConfigOptions } from './upgrades/addPollingConfigOptions.js'

/**
 * Upgrade scripts are positional: Companion stores how many of them a connection has already run.
 * Never remove, reorder or dedupe entries (UpgradeV2ToV3 is listed twice on purpose); only append.
 */
export const UpgradeScripts: CompanionStaticUpgradeScript<ZoomConfig>[] = [
	UpgradeV2ToV3,
	UpgradeV2ToV3,
	addNewConfigFieldsForSocialStreamAndPerformanceTweaks,
	fixWrongPinCommands,
	addNewConfigFieldsForSocialStreamChatMessagesToSend,
	addPollingConfigOptions,
]
