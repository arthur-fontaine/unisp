import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createJiti } from "jiti";
import { httpSpec } from "./specs/http-spec.js";
import { Generator } from "./types/generator.js";
import { BaseSpec } from "./specs/base-spec.js";

type GeneratorConstructor = new () => Generator<BaseSpec<any, any>>;

interface RuntimeOptions {
	outputPath: string;
}

export async function runtime(source: string, options?: RuntimeOptions) {
	const optionsWithDefaults = {
		outputPath: "output",
		...options,
	};

	const cwd = process.cwd();
	const jiti = createJiti(cwd);

	const {
		generators,
		basePath,
		...specs
	}: Record<string, ReturnType<typeof httpSpec>> & {
		generators: GeneratorConstructor[];
		basePath: string;
	} = await jiti.import(source);

	generators.forEach((Generator) => {
		const generator = new Generator();
		const result = generator.generate({
			filePath: source,
			stackNames: [],
			specs,
			params: {
				basePath,
			},
		});

		const outputPath = path.resolve(
			cwd,
			optionsWithDefaults.outputPath,
			generator.outputPath,
		);
		fs.mkdirSync(path.dirname(outputPath), { recursive: true });
		fs.writeFileSync(
			path.resolve(cwd, optionsWithDefaults.outputPath, generator.outputPath),
			result,
		);
	});
}
