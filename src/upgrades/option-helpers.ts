import type { CompanionMigrationOptionValues, JsonValue } from '@companion-module/base'

/**
 * Upgrade scripts see every option wrapped as { isExpression, value }.
 * Returns the literal (non-expression) value of an option, or undefined if it is missing or an expression.
 */
export function getLiteralOption(options: CompanionMigrationOptionValues, key: string): JsonValue | undefined {
	const opt = options[key]
	if (!opt || opt.isExpression) return undefined
	return opt.value
}

/** Stores a literal value in the wrapped { isExpression: false, value } shape */
export function setLiteralOption(options: CompanionMigrationOptionValues, key: string, value: JsonValue): void {
	options[key] = { isExpression: false, value }
}
