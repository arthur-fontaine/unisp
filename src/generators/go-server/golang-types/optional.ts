import { OptionalType } from "../../../schema/schema.js";
import { ExternalTypeBinding } from "../../../types/external-type-binding.js";
import { GenerateContext } from "../types.js";
import { addStack } from "../utils/add-stack.js";
import { getNativeType } from "../utils/get-native-type.js";
import { writeContent, writeContentAtRoot } from "../utils/write-content.js";

export class OptionalPython extends ExternalTypeBinding<OptionalType> {
	typeFromSchema = "optional" as const;

	*getNativeType(type: OptionalType, context: GenerateContext) {
		const name = context.stackNames.join("_") + "_optional";

		yield* writeContentAtRoot(`type ${name} = `, 0);
		yield* writeContent(name, 0);

		let optionalInnerCode = "";
		let root = "\n";

		for (const part of getNativeType(type.t, addStack(context, "optional"))) {
			if (part.atRoot) {
				root += part.content;
			} else {
				optionalInnerCode += `*(${part.content})`;
			}
		}

		yield* writeContentAtRoot(`${optionalInnerCode}`, 0, true);
		yield* writeContentAtRoot(root, 0, true);
	}
}
