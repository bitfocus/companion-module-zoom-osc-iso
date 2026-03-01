import type { Config } from 'jest'

const config: Config = {
	preset: 'ts-jest/presets/default-esm',
	testEnvironment: 'node',
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		// Redirect feedback-state-machine to a lightweight mock (avoids CJS require('./images') in ESM)
		'.*/feedback-state-machine.*': '<rootDir>/tests/__mocks__/feedback-state-machine',
		// Resolve TypeScript source files from .js imports (Node16 ESM style)
		'^(\\.{1,2}/.*)\\.js$': '$1',
		// Mock images module to avoid CJS require() in ESM test context
		'.*/src/images$': '<rootDir>/tests/__mocks__/images',
	},
	transform: {
		'^.+\\.tsx?$': ['ts-jest', { useESM: true }],
	},
	testMatch: ['<rootDir>/tests/**/*.test.ts'],
	setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
}

export default config
