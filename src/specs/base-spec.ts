import * as schema from "../schema/schema.js";

export interface BaseSpec<T, S extends symbol> {
	(b: (s: typeof schema) => T): T & { __specSymbol: S };
}
