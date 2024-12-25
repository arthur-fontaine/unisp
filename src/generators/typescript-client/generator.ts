import dedent from "dedent";
import { httpSpec } from "../../specs/http-spec.js";
import type { Generator } from "../../types/generator.js";
import { TypeScriptTypesGenerator } from "../typescript-types/generator.js";
import { Generate } from "./types.js";
import { formatVariableName } from "./utils/format-variable-name.js";

export class TypeScriptClientGenerator implements Generator<typeof httpSpec> {
	outputPath = "typescript-client/index.ts";

	generate: Generate = (context) => {
		const typescriptTypes = new TypeScriptTypesGenerator().generate(context);

		const fileName = context.filePath.split("/").pop()!.split(".")[0];

		return dedent/* ts */ `
			${typescriptTypes}

			export function ${formatVariableName(`create_${fileName}_Client`, "variable")}(options: {
			  url: string,
				options?: RequestInit
			}): ${formatVariableName(`${fileName}Service`, "type")} {
			  return {
					${Object.entries(context.specs)
						.map(([name, spec]) => {
							return /* ts */ `
							"${name}": async (body) => await fetch(options.url + "${spec.path}", {
							  ...options.options,
								method: "${spec.method}",
							  body: JSON.stringify(body)
							}).then(res => res.json()),
						`;
						})
						.join("\n")}
        }
			}
		`;
	};
}
