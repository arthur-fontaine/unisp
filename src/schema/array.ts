import { SchemaType } from "../types/schema-type.js";

type ArrayProperties = SchemaType[];

export class ArrayType<
	T extends ArrayProperties = ArrayProperties,
> extends SchemaType {
	type = "array" as const;

	constructor(public elements: T) {
		super();
	}
}

interface ArraySchema {
	<T extends ArrayProperties>(elements: T): ArrayType<T>;
}

export const array: ArraySchema = (elements) => new ArrayType(elements);
