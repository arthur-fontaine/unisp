import { FloatType } from "../../../schema/schema.js";
import { ExternalTypeBinding } from "../../../types/external-type-binding.js";
import { writeContent } from "../utils/write-content.js";

export class FloatPython extends ExternalTypeBinding<FloatType> {
	typeFromSchema = "float" as const;

	*getNativeType() {
		yield* writeContent("float", 0);
	}
}
