import { describe, expect, it } from 'vitest'
import { toOutgoingMessage, toZoomOSCResponse } from '../../src/osc/transport.js'

describe('toZoomOSCResponse', () => {
	it('keeps each argument with its type tag, so a whole-number decimal stays a decimal', () => {
		expect(
			toZoomOSCResponse({
				address: '/zoomosc/user/online',
				args: [
					{ type: 'i', value: 0 },
					{ type: 's', value: 'Alice' },
					{ type: 'f', value: 1 },
					{ type: 'i', value: 101 },
				],
			}),
		).toEqual({
			address: '/zoomosc/user/online',
			args: [
				{ type: 'i', value: 0 },
				{ type: 's', value: 'Alice' },
				{ type: 'f', value: 1 },
				{ type: 'i', value: 101 },
			],
		})
	})

	it('leaves 32-bit Zoom IDs as they are, as ZoomOSC 4 and ZoomISO 3.0.6 send them', () => {
		const message = {
			address: '/zoomosc/galleryOrder',
			args: [
				{ type: 'i', value: 101 },
				{ type: 'i', value: 102 },
			],
		}
		expect(toZoomOSCResponse(message)).toEqual(message)
	})

	it('turns true and false into 1 and 0, as the handlers expect', () => {
		expect(
			toZoomOSCResponse({
				address: '/zoomosc/pong',
				args: [
					{ type: 'T', value: true },
					{ type: 'F', value: false },
				],
			}).args,
		).toEqual([
			{ type: 'i', value: 1 },
			{ type: 'i', value: 0 },
		])
	})

	it('turns 64-bit Zoom IDs into numbers, as ZoomOSC 5.0.1 and ZoomISO 3.0.7 send them', () => {
		// exactly as ZoomOSC 5.0.1 sent it on 2026-11-14 (osc reads each h argument as { high, low })
		const long = (low: number, high = 0) => ({ type: 'h', value: { low, high, unsigned: false } })
		expect(
			toZoomOSCResponse({ address: '/zoomosc/spotOrder', args: [long(33555456), long(33556480), long(33557504)] }),
		).toEqual({
			address: '/zoomosc/spotOrder',
			args: [
				{ type: 'h', value: 33555456 },
				{ type: 'h', value: 33556480 },
				{ type: 'h', value: 33557504 },
			],
		})

		// the upper 32 bits count too, and the lower 32 bits are unsigned
		expect(toZoomOSCResponse({ address: '/a', args: [long(-1, 0), long(5, 1), long(-1, -1)] }).args).toEqual([
			{ type: 'h', value: 4294967295 },
			{ type: 'h', value: 4294967301 },
			{ type: 'h', value: -1 },
		])
	})
})

describe('toOutgoingMessage', () => {
	it('sends no arguments when there are none', () => {
		expect(toOutgoingMessage('/zoom/ping')).toEqual({ address: '/zoom/ping', args: [] })
		expect(toOutgoingMessage('/zoom/empty', [])).toEqual({ address: '/zoom/empty', args: [] })
	})

	it('sends typed arguments as given, one or many', () => {
		expect(toOutgoingMessage('/zoom/scalar', { type: 'i', value: 7 })).toEqual({
			address: '/zoom/scalar',
			args: [{ type: 'i', value: 7 }],
		})
		expect(
			toOutgoingMessage('/zoom/mixed', [
				{ type: 's', value: 'hello' },
				{ type: 'f', value: 2 },
			]),
		).toEqual({
			address: '/zoom/mixed',
			args: [
				{ type: 's', value: 'hello' },
				{ type: 'f', value: 2 },
			],
		})
	})

	it('types bare values the way node-osc did', () => {
		const bytes = new Uint8Array([1, 2])
		expect(toOutgoingMessage('/zoom/bare', ['Alice', 3, 1.5, bytes]).args).toEqual([
			{ type: 's', value: 'Alice' },
			{ type: 'i', value: 3 },
			{ type: 'f', value: 1.5 },
			{ type: 'b', value: bytes },
		])
	})
})
