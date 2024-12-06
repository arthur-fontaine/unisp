import dedent from "dedent";
import { httpSpec } from "../../specs/http-spec.js";
import type { Generator } from "../../types/generator.js";
import { TypeScriptTypesGenerator } from "../typescript-types/generator.js";
import { Generate, GenerateContext, HttpSpec } from "./types.js";

export class HonoMiddlewareGenerator implements Generator<typeof httpSpec> {
	generate: Generate = (context) => {
		const typescriptTypes = new TypeScriptTypesGenerator().generate(context);

		const fileName = context.filePath.split("/").pop()!.split(".")[0];
		const serviceName = `${fileName}Service`;

		return dedent/* ts */ `
		  import type { MiddlewareHandler } from "hono";

			${typescriptTypes}

			export function create${serviceName}(service: ${serviceName}) {
			  const middleware: MiddlewareHandler = async (c, next) => {
					const path = c.req.routePath
					const method = c.req.method
					const body = await c.req.json()

					${Object.entries(context.specs)
						.map(([name, spec]) => {
							return /* ts */ `
							if (path === '${spec.path}' && method === '${spec.method}') {
					      const response = await service.${name}(body)
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
