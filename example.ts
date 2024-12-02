import { httpSpec } from "./src/index.js";

export const getPet = httpSpec((s) => ({
	path: "/get-pet",
	method: "POST",
	request: [s.string()],
	response: s.object({
		name: s.string(),
	}),
}));

export const createPet = httpSpec((s) => ({
	path: "/create-pet",
	method: "POST",
	request: [
		s.object({
			name: s.string(),
		}),
	],
	response: s.object({
		id: s.string(),
	}),
}));
