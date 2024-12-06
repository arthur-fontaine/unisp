import { OptionalType } from "../../../schema/schema.js";
import { ExternalTypeBinding } from "../../../types/external-type-binding.js";
import { GenerateContext } from "../types.js";
import { addStack } from "../utils/add-stack.js";
import { getNativeType } from "../utils/get-native-type.js";
import { writeContent, writeContentAtRoot } from "../utils/write-content.js";

export class OptionalPython extends ExternalTypeBinding<OptionalType> {
	typeFromSchema = "optional" as const;

	*getNativeType(type: OptionalType, context: GenerateContext) {
		let optionalInnerCode = "";
		let root = "\n";

		for (const part of getNativeType(type.t, addStack(context, "optional"))) {
			if (part.atRoot) {
				root += part.content;
			} else {
				optionalInnerCode = `((${part.content}) | undefined)`;
			}
		}

		yield* writeContent(optionalInnerCode, 0);
		yield* writeContentAtRoot(root, 0, true);
	}
}
