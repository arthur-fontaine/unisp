import { SchemaType } from "../types/schema-type.js";

export class StringType extends SchemaType {
	type = "string" as const;
}

interface StringSchema {
	(): StringType;
}

export const string: StringSchema = () => new StringType();
