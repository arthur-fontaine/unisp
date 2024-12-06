import eslint from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import n from "eslint-plugin-n";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: [
			"coverage*",
			"dist",
			"node_modules",
			"pnpm-lock.yaml",
			"**/*.snap",
		],
	},
	{
		linterOptions: {
			reportUnusedDisableDirectives: "error",
		},
	},
	eslint.configs.recommended,
	n.configs["flat/recommended"],
	{
		extends: tseslint.configs.recommendedTypeChecked,
		files: ["**/*.js", "**/*.ts"],
		languageOptions: {
			parserOptions: {
				projectService: {
					allowDefaultProject: ["*.config.*s"],
				},
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		extends: [tseslint.configs.disableTypeChecked],
		files: ["**/*.md/*.ts"],
		rules: {
			"n/no-missing-import": ["error", { allowModules: ["unisp"] }],
		},
	},
	{
		files: ["**/*.test.*"],
		extends: [vitest.configs.recommended],
		rules: {
			// These on-by-default rules aren't useful in test files.
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-call": "off",
		},
	},
);
