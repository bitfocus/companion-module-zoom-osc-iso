import { describe, it, expect } from 'vitest'
import { isZoomOSC5OrZoomISO3OrLater } from '../src/utils.js'

describe('isZoomOSC5OrZoomISO3OrLater', () => {
	it.each(['ZOSC_5.0.1_MAC', 'ZOSC_5.0.0_MAC', 'ZISO_3.0.7_MAC', 'ZOSC_6.0.0_MAC', 'ZISO_4.0.0_MAC'])(
		'is true for %s',
		(version) => {
			expect(isZoomOSC5OrZoomISO3OrLater(version)).toBe(true)
		},
	)

	it.each(['ZOSC_4.6.1_MAC', 'ZISO_2.4.1_pro_MAC', 'Not Connected', '', 0])('is false for %s', (version) => {
		expect(isZoomOSC5OrZoomISO3OrLater(version)).toBe(false)
	})
})
