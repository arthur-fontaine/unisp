import { ExternalTypeBinding } from "./external-type-binding.js";
import { GenerateContext } from "./generator.js";

export abstract class SchemaType {
	abstract type: string;

	*getNativeType(
		ts: (new () => ExternalTypeBinding<SchemaType>)[],
		context: GenerateContext,
	) {
		for (const T of ts) {
			const t = new T();
			if (t.typeFromSchema === this.type) {
				yield* t.getNativeType(this, context);
				return;
			}
		}

		throw new Error(`Native type not found for ${this.type}`);
	}
}
