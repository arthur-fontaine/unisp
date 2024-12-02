import { SchemaType } from "../types/schema-type.js";

interface ObjectProperties {
	[key: string]: SchemaType;
}

export class ObjectType<
	T extends ObjectProperties = ObjectProperties,
> extends SchemaType {
	type = "object" as const;

	constructor(public properties: T) {
		super();
	}
}

interface ObjectSchema {
	<T extends ObjectProperties>(properties: T): ObjectType<T>;
}

export const object: ObjectSchema = (properties) => new ObjectType(properties);
