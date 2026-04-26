import { CompanionVariableValues } from '@companion-module/base'
import type { InstanceBaseExt } from '../utils.js'
import type { ZoomConfig } from '../config.js'

export function setVariables(
	instance: InstanceBaseExt<ZoomConfig>,
	updater: (variables: CompanionVariableValues) => void,
): void {
	const variables: CompanionVariableValues = {}
	updater(variables)
	instance.setVariableValues(variables)
}
