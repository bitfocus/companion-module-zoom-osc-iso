import type { Config } from 'jest'

const config: Config = {
	testEnvironment: 'node',
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		// Stub feedback-state-machine (uses CJS require('./images') incompatible with ts-jest)
		'.*/feedback-state-machine.*': '<rootDir>/tests/__mocks__/feedback-state-machine',
		// Resolve TypeScript source files from .js imports (Node16 module style)
		'^(\\.{1,2}/.*)\\.js$': '$1',
		// Stub images module
		'.*/src/images$': '<rootDir>/tests/__mocks__/images',
	},
	transformIgnorePatterns: ['/node_modules/(?!(?:@companion-module/base)/)'],
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{ useESM: true, tsconfig: '<rootDir>/tsconfig.json', diagnostics: { ignoreCodes: [151002] } },
		],
	},
	testMatch: ['<rootDir>/tests/**/*.test.ts'],
	setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
}

export default config
