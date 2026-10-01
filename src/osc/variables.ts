import type ModuleInstance from '../index.js'
import type { CompanionVariableValues } from '@companion-module/base'

export function setVariables(
	instance: ModuleInstance,
	updater: (variables: CompanionVariableValues) => void,
): void {
	const variables: CompanionVariableValues = {}
	updater(variables)
	instance.setVariableValues(variables)
}
