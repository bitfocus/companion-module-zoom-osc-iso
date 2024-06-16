import { ZoomConfig } from './config.js'
import { InstanceBaseExt } from './utils.js'
import { initVariableDefinitions } from './variables/variable-definitions.js'
import { updateVariableValues } from './variables/variable-values.js'

export function updateVariables(instance: InstanceBaseExt<ZoomConfig>): void {
	updateVariableValues(instance)
}

export function initVariables(instance: InstanceBaseExt<ZoomConfig>): void {
	initVariableDefinitions(instance)
}
