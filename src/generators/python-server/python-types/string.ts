import { StringType } from "../../../schema/schema.js";
import { ExternalTypeBinding } from "../../../types/external-type-binding.js";

export class StringPython extends ExternalTypeBinding<StringType> {
	typeFromSchema = "string" as const;

	*getNativeType() {
		yield { atRoot: false, content: "str" };
	}
}
