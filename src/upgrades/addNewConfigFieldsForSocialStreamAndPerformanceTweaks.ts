import {
	CompanionUpgradeContext,
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeResult,
} from '@companion-module/base'
import { ZoomConfig } from '../config.js'

export function addNewConfigFieldsForSocialStreamAndPerformanceTweaks(
	_context: CompanionUpgradeContext<ZoomConfig>,
	_props: CompanionStaticUpgradeProps<ZoomConfig>,
): CompanionStaticUpgradeResult<ZoomConfig> {
	const result: CompanionStaticUpgradeResult<ZoomConfig> = {
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
		updatedFeedbacks: [],
	}

	return result
}
