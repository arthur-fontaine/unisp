import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createJiti } from "jiti";
import { PythonServerGenerator } from "./generators/python-server/generator.js";
import { httpSpec } from "./specs/http-spec.js";
import { TypeScriptTypesGenerator } from "./generators/typescript-types/generator.js";
import { HonoMiddlewareGenerator } from "./generators/hono-middleware/generator.js";
import { TypeScriptClientGenerator } from "./generators/typescript-client/generator.js";
import { GoServerGenerator } from "./generators/go-server/generator.js";
import { Generator } from "./types/generator.js";
import { BaseSpec } from "./specs/base-spec.js";

type GeneratorConstructor = new () => Generator<BaseSpec<any, any>>;

interface RuntimeOptions {
	outputPath: string;
}

async function runtime(
	source: string,
	generators: GeneratorConstructor[],
	options?: RuntimeOptions,
) {
	const optionsWithDefaults = {
		outputPath: "output",
		...options,
	};

	const cwd = process.cwd();
	const absoluteSource = path.resolve(cwd, source);
	const jiti = createJiti(absoluteSource);

	const specs: Record<string, ReturnType<typeof httpSpec>> = await jiti.import(
		source,
	);

	generators.forEach((Generator) => {
		const generator = new Generator();
		const result = generator.generate({
			filePath: source,
			stackNames: [],
			specs,
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

void runtime("./example.ts", [
	PythonServerGenerator,
	TypeScriptTypesGenerator,
	TypeScriptClientGenerator,
	HonoMiddlewareGenerator,
	GoServerGenerator,
]);
