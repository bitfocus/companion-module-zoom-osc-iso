import {
	CompanionUpgradeContext,
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeResult,
} from '@companion-module/base'
import type { ZoomConfig } from '../config.js'

export function addNewConfigFieldsForSocialStreamAndPerformanceTweaks(
	_context: CompanionUpgradeContext<ZoomConfig>,
	_props: CompanionStaticUpgradeProps<ZoomConfig, undefined>,
): CompanionStaticUpgradeResult<ZoomConfig, undefined> {
	const result: CompanionStaticUpgradeResult<ZoomConfig, undefined> = {
		updatedActions: [],
		updatedConfig: {
			..._context.currentConfig,
			enableSocialStream: false,
			socialStreamId: '',
			socialStreamQuestionPrefix: '',
			enableVariablesForEachUser: true,
			enableVariablesForParticipants: true,
			enableActionPresetAndFeedbackSync: true,
		},
		updatedSecrets: null,
		updatedFeedbacks: [],
	}

	return result
}
