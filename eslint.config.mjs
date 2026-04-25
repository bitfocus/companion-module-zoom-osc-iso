import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

const baseConfig = await generateEslintConfig({
	enableTypescript: true,
})

const customConfig = [
	...baseConfig,
	{
		files: ['src/**/*.ts', 'src/**/*.js', 'src/**/*.mjs', 'tests/**/*.ts', 'jest.config.ts'],
	},
	// Test files: relax rules that are noisy in Jest test contexts
	{
		files: ['tests/**/*.ts'],
		rules: {
			'@typescript-eslint/unbound-method': 'off',
			'@typescript-eslint/await-thenable': 'off',
			'@typescript-eslint/no-unnecessary-type-assertion': 'off',
			'n/no-unpublished-import': 'off',
		},
	},
	// Config files: dev deps are valid imports
	{
		files: ['jest.config.ts', '*.config.ts', '*.config.mjs'],
		rules: {
			'n/no-unpublished-import': 'off',
		},
	},
	{
		rules: {
			'no-use-before-define': 'off',
			'@typescript-eslint/no-use-before-define': 'off',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/camelcase': 'off',
			'@typescript-eslint/ban-ts-ignore': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'prettier/prettier': ['warn', { endOfLine: 'lf' }],
		},
	},
]

export default customConfig
