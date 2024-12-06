import { IntType } from "../../../schema/schema.js";
import { ExternalTypeBinding } from "../../../types/external-type-binding.js";
import { writeContent } from "../utils/write-content.js";

export class IntPython extends ExternalTypeBinding<IntType> {
	typeFromSchema = "int" as const;

	*getNativeType() {
		yield* writeContent("int", 0);
	}
}
