import { defineConfig } from "@rslib/core";

export default defineConfig({
	lib: [
		{
			format: "esm",
			syntax: "es2021",
			dts: true,
		},
	],
	source: {
		entry: {
			index: "./src/index.ts",
			generators: "./src/generators.ts",
			cli: "./src/cli/cli.ts",
		},
	},
});
