import { SchemaType } from "../types/schema-type.js";

type OptionalT = SchemaType;

export class OptionalType<T extends OptionalT = OptionalT> extends SchemaType {
	type = "optional" as const;

	constructor(public t: T) {
		super();
	}
}

interface OptionalSchema {
	<T extends OptionalT>(t: T): OptionalType<T>;
}

export const optional: OptionalSchema = (t) => new OptionalType(t);
