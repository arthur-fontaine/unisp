import * as schema from "../schema/schema.js";
import { SchemaType } from "../types/schema-type.js";
import { BaseSpec } from "./base-spec.js";

type Path = `/` | `/${string}`;
type Method = "GET" | "POST" | "PUT" | "DELETE";

export const httpSpecSymbol = Symbol("httpSpec");

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HttpSpec
	extends BaseSpec<
		{
			path: Path;
			method: Method;
			request: SchemaType;
			response: SchemaType;
		},
		typeof httpSpecSymbol
	> {}

export const httpSpec: HttpSpec = (s) => ({
	...s(schema),
	__specSymbol: httpSpecSymbol,
});
