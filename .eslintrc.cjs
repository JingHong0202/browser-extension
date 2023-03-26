require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
	env: {
		browser: true,
		es2022: true,
		node: true
	},
	extends: [
	  'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier'
	],
	root: true,
	parser: 'vue-eslint-parser',
	plugins: ['@typescript-eslint'],
	root: true,
	parserOptions: {
		project: true,
		tsconfigRootDir: __dirname,
		ecmaVersion: 'latest',
    sourceType: 'module'
	},
	rules: {
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		"@typescript-eslint/no-floating-promises": "off",
		'no-mixed-spaces-and-tabs': 'off',
		"@typescript-eslint/no-unsafe-call": 'off',
		// "semi": "off",
    // "@typescript-eslint/semi": "off"
		// '@typescript-eslint/no-floating-promises': 'off'
	}
}
