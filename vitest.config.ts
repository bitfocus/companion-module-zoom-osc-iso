import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const mock = (file: string): string => fileURLToPath(new URL(`./tests/__mocks__/${file}`, import.meta.url))

export default defineConfig({
	resolve: {
		// Equivalent of the former jest moduleNameMapper entries
		alias: [
			// Stub the feedback state machine (it pulls in the large base64 image table)
			{ find: /^.*\/feedback-state-machine(\.js)?$/, replacement: mock('feedback-state-machine.ts') },
			// Stub the images module
			{ find: /^.*\/src\/images(\.js)?$/, replacement: mock('images.ts') },
		],
	},
	test: {
		environment: 'node',
		include: ['tests/**/*.test.ts'],
		setupFiles: ['tests/setup.ts'],
		globals: false,
	},
})
