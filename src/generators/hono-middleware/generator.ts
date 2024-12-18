import dedent from "dedent";
import { httpSpec } from "../../specs/http-spec.js";
import type { Generator } from "../../types/generator.js";
import { TypeScriptTypesGenerator } from "../typescript-types/generator.js";
import { Generate } from "./types.js";
import { formatVariableName } from "./utils/format-variable-name.js";

export class HonoMiddlewareGenerator implements Generator<typeof httpSpec> {
	outputPath = "hono-middleware/index.ts";

	generate: Generate = (context) => {
		const typescriptTypes = new TypeScriptTypesGenerator().generate(context);

		const fileName = context.filePath.split("/").pop()!.split(".")[0];
		const serviceName = formatVariableName(`${fileName}Service`, "type");

		return dedent/* ts */ `
		  import type { MiddlewareHandler } from "hono";

			${typescriptTypes}

			export function create${serviceName}(service: ${serviceName}) {
			  const middleware: MiddlewareHandler = async (c, next) => {
					const path = c.req.path
					const method = c.req.method
					const body = await c.req.json()

					${Object.entries(context.specs)
						.map(([name, spec]) => {
							return /* ts */ `
							if (path === '${spec.path}' && method === '${spec.method}') {
					      const response = await service.${formatVariableName(name, "variable")}(body)
								return c.json(response)
							}
						`;
						})
						.join("\n")}

					await next()
				}
				return middleware
			}
		`;
	};
}
