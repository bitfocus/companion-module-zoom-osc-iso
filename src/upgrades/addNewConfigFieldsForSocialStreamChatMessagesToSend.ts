import {
	CompanionUpgradeContext,
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeResult,
} from '@companion-module/base'
import type { ZoomConfig } from '../config.js'

export function addNewConfigFieldsForSocialStreamChatMessagesToSend(
	_context: CompanionUpgradeContext<ZoomConfig>,
	_props: CompanionStaticUpgradeProps<ZoomConfig, undefined>,
): CompanionStaticUpgradeResult<ZoomConfig, undefined> {
	const result: CompanionStaticUpgradeResult<ZoomConfig, undefined> = {
		updatedActions: [],
		updatedConfig: {
			..._context.currentConfig,
			socialStreamChatTypeToSend: [0, 1, 2],
		},
		updatedSecrets: null,
		updatedFeedbacks: [],
	}

	return result
}
