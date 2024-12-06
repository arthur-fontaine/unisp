import { SchemaType } from "../types/schema-type.js";

export class IntType extends SchemaType {
	type = "int" as const;
}

interface IntSchema {
	(): IntType;
}

export const int: IntSchema = () => new IntType();
