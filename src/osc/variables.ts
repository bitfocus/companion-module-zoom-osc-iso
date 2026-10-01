import type { VariableValues } from '../variables/variable-definitions.js'
import type ModuleInstance from '../index.js'

export function setVariables(instance: ModuleInstance, updater: (variables: VariableValues) => void): void {
	const variables: VariableValues = {}
	updater(variables)
	instance.setVariableValues(variables)
}
