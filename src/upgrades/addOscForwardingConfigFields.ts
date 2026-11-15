import type {
	CompanionUpgradeContext,
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeResult,
} from '@companion-module/base'
import type { ZoomConfig } from '../config.js'
import { DEFAULT_FORWARD_HOST, DEFAULT_FORWARD_PORT } from '../osc/forwarder.js'

/** OSC Forwarding starts off, pointed at the default address */
export function addOscForwardingConfigFields(
	_context: CompanionUpgradeContext<ZoomConfig>,
	_props: CompanionStaticUpgradeProps<ZoomConfig, undefined>,
): CompanionStaticUpgradeResult<ZoomConfig, undefined> {
	const current = _context.currentConfig
	return {
		updatedActions: [],
		updatedConfig: {
			...current,
			enableOscForwarding: current.enableOscForwarding ?? false,
			oscForwardHost: current.oscForwardHost ?? DEFAULT_FORWARD_HOST,
			oscForwardPort: current.oscForwardPort ?? DEFAULT_FORWARD_PORT,
		},
		updatedFeedbacks: [],
	}
}
