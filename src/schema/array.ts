import { SchemaType } from "../types/schema-type.js";

type ArrayProperties = SchemaType;

export class ArrayType<
	T extends ArrayProperties = ArrayProperties,
> extends SchemaType {
	type = "array" as const;

	constructor(public item: T) {
		super();
	}
}

interface ArraySchema {
	<T extends ArrayProperties>(element: T): ArrayType<T>;
}

export const array: ArraySchema = (element) => new ArrayType(element);
