import { StringType } from "../../../schema/schema.js";
import { ExternalTypeBinding } from "../../../types/external-type-binding.js";
import { writeContent } from "../utils/write-content.js";

export class StringPython extends ExternalTypeBinding<StringType> {
	typeFromSchema = "string" as const;

	*getNativeType() {
		yield* writeContent("str", 0);
	}
}
