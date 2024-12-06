import path from "node:path";
import process from "node:process";
import { createJiti } from "jiti";
import { PythonServerGenerator } from "./generators/python-server/generator.js";
import { httpSpec } from "./specs/http-spec.js";
import { TypeScriptTypesGenerator } from "./generators/typescript-types/generator.js";
import { HonoMiddlewareGenerator } from "./generators/hono-middleware/generator.js";
import { TypeScriptClientGenerator } from "./generators/typescript-client/generator.js";

async function runtime(source: string) {
	const cwd = process.cwd();
	const absoluteSource = path.resolve(cwd, source);
	const jiti = createJiti(absoluteSource);

	const specs: Record<string, ReturnType<typeof httpSpec>> = await jiti.import(
		source,
	);

	const g = new TypeScriptClientGenerator();
	const result = g.generate({
		filePath: source,
		stackNames: [],
		specs,
	});

	console.log(result);
}

void runtime("./example.ts");
