import { GenerateContext } from "./generator.js";
import { SchemaType } from "./schema-type.js";

export abstract class ExternalTypeBinding<T extends SchemaType> {
	abstract typeFromSchema: T["type"];
	abstract getNativeType(
		type: T,
		context: GenerateContext,
	): Generator<{ atRoot?: boolean; content: string }>;
}
