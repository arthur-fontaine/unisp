import { httpSpec } from "./src/index.js";

export const getPet = httpSpec((s) => ({
	path: "/get-pet",
	method: "POST",
	request: s.object({
		a: s.optional(s.tuple([s.string(), s.int()])),
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
