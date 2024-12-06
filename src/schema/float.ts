import { SchemaType } from "../types/schema-type.js";

export class FloatType extends SchemaType {
	type = "float" as const;
}

interface FloatSchema {
	(): FloatType;
}

export const float: FloatSchema = () => new FloatType();
