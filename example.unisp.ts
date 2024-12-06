import { httpSpec } from "./src/index.js";
import { PythonServerGenerator } from "./src/generators/python-server/generator.js";
import { TypeScriptTypesGenerator } from "./src/generators/typescript-types/generator.js";
import { HonoMiddlewareGenerator } from "./src/generators/hono-middleware/generator.js";
import { TypeScriptClientGenerator } from "./src/generators/typescript-client/generator.js";
import { GoServerGenerator } from "./src/generators/go-server/generator.js";

export const generators = [PythonServerGenerator];

export const getPet = httpSpec((s) => ({
	path: "/get-pet",
	method: "POST",
	request: s.object({
		alo_oui: s.optional(s.string()),
	}),
	response: s.int(),
}));

// export const createPet = httpSpec((s) => ({
//   path: "/create-pet",
//   method: "POST",
//   request: s.object({
//     name: s.optional(s.string()),
//   }),
//   response: s.object({
//     id: s.string(),
//     test: s.object({
//       test2: s.int(),
//     }),
//   }),
// }));
