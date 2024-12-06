import dedent from "dedent";
import { httpSpec } from "../../specs/http-spec.js";
import type { Generator } from "../../types/generator.js";
import { TypeScriptTypesGenerator } from "../typescript-types/generator.js";
import { Generate, GenerateContext, HttpSpec } from "./types.js";

export class TypeScriptClientGenerator implements Generator<typeof httpSpec> {
	generate: Generate = (context) => {
		const typescriptTypes = new TypeScriptTypesGenerator().generate(context);

		const fileName = context.filePath.split("/").pop()!.split(".")[0];

		return dedent/* ts */ `
		  import type { MiddlewareHandler } from "hono";

			${typescriptTypes}

			export function create${fileName}Client(options: {
			  url: string,
				options?: RequestInit
			}): ${fileName}Service {
			  return {
					${Object.entries(context.specs)
						.map(([name, spec]) => {
							return /* ts */ `
							"${name}": async (body) => await fetch(options.url + "${spec.path}", {
							  ...options.options,
								method: "${spec.method}",
							  body: JSON.stringify(body)
							}).then(res => res.json())
						`;
						})
						.join("\n")}
        }
			}
		`;
	};
}
