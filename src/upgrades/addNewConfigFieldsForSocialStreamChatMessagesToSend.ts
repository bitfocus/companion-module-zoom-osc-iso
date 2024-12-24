import {
	CompanionUpgradeContext,
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeResult,
} from '@companion-module/base/dist'
import { ZoomConfig } from '../config.js'

export function addNewConfigFieldsForSocialStreamChatMessagesToSend(
	_context: CompanionUpgradeContext<ZoomConfig>,
	_props: CompanionStaticUpgradeProps<ZoomConfig>,
): CompanionStaticUpgradeResult<ZoomConfig> {
	const result: CompanionStaticUpgradeResult<ZoomConfig> = {
		updatedActions: [],
		updatedConfig: {
			..._context.currentConfig,
			socialStreamChatTypeToSend: [0, 1, 2],
		},
		updatedFeedbacks: [],
	}

	return result
}
