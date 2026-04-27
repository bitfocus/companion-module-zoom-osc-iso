import {
	CompanionUpgradeContext,
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeResult,
} from '@companion-module/base'
import { ZoomConfig } from '../config.js'

export function addPollingConfigOptions(
	_context: CompanionUpgradeContext<ZoomConfig>,
	_props: CompanionStaticUpgradeProps<ZoomConfig, undefined>,
): CompanionStaticUpgradeResult<ZoomConfig, undefined> {
	const result: CompanionStaticUpgradeResult<ZoomConfig, undefined> = {
		updatedActions: [],
		updatedConfig: {
			..._context.currentConfig,
			pollEngineState: true,
			pollAudioLevels: true,
			pollOutputRouting: true,
			pollAudioRouting: true,
		},
		updatedFeedbacks: [],
	}

	return result
}
