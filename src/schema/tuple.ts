import { SchemaType } from "../types/schema-type.js";

type TupleProperties = SchemaType[];

export class TupleType<
	T extends TupleProperties = TupleProperties,
> extends SchemaType {
	type = "tuple" as const;

	constructor(public elements: T) {
		super();
	}
}

interface TupleSchema {
	<T extends TupleProperties>(elements: T): TupleType<T>;
}

export const tuple: TupleSchema = (elements) => new TupleType(elements);
