import type { ZoomOSCArgument, ZoomOSCResponse } from './types.js'

/**
 * ZoomOSC 5.0.1 and ZoomISO 3.0.7 send the Zoom IDs in /zoomosc/galleryOrder and /zoomosc/spotOrder as 64-bit
 * integers (OSC type tag h), where ZoomOSC 4 and ZoomISO 3.0.6 send 32-bit integers (type tag i). osc reads a
 * 64-bit integer as a Long object ({ high, low }), which the handlers can't use as a Zoom ID, so the gallery and
 * the Spotlights group never filled in.
 *
 * This turns every type h argument into a plain number. Going by each argument's type tag, rather than by the app's
 * version, keeps old and new versions working. A message with no type h argument is returned as is.
 */
export function convertInt64Args(message: ZoomOSCResponse): ZoomOSCResponse {
	if (!Array.isArray(message.args) || !message.args.some((arg) => arg?.type === 'h')) return message

	return {
		...message,
		args: message.args.map(
			(arg): ZoomOSCArgument => (arg?.type === 'h' ? { type: 'h', value: int64ToNumber(arg.value) } : arg),
		),
	}
}

/**
 * osc gives a 64-bit integer as { high, low }: a Long from the long package, or a plain object without it. high is
 * the signed upper 32 bits; low holds the lower 32 bits but is read as signed, hence >>> 0. Zoom IDs are far below
 * 2^53, so the plain number is exact.
 */
function int64ToNumber(value: unknown): number {
	if (typeof value === 'number') return value
	if (typeof value === 'bigint') return Number(value)
	if (typeof value === 'object' && value !== null && 'high' in value && 'low' in value) {
		const { high, low } = value as { high: number; low: number }
		return high * 2 ** 32 + (low >>> 0)
	}
	return Number(value)
}
