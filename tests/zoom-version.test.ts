import { describe, it, expect } from 'vitest'
import { isZoomISO3OrLater } from '../src/utils.js'

describe('isZoomISO3OrLater', () => {
	it.each(['ZISO_3.0.7_MAC', 'ZISO_4.0.0_MAC'])('is true for %s', (version) => {
		expect(isZoomISO3OrLater(version)).toBe(true)
	})

	it.each(['ZISO_2.4.1_pro_MAC', 'ZOSC_5.0.1_MAC', 'ZOSC_5.0.0_MAC', 'ZOSC_4.6.1_MAC', 'Not Connected', '', 0])(
		'is false for %s',
		(version) => {
			expect(isZoomISO3OrLater(version)).toBe(false)
		},
	)
})
