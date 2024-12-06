import { ArrayType } from "../../../schema/schema.js";
import { ExternalTypeBinding } from "../../../types/external-type-binding.js";
import { GenerateContext } from "../types.js";
import { addStack } from "../utils/add-stack.js";
import { getNativeType } from "../utils/get-native-type.js";
import { writeContent, writeContentAtRoot } from "../utils/write-content.js";

export class ArrayPython extends ExternalTypeBinding<ArrayType> {
	typeFromSchema = "array" as const;

	*getNativeType(type: ArrayType, context: GenerateContext) {
		const name = context.stackNames.join("_");

		yield* writeContent(name, 0);

		let root = "\n";

		for (const part of getNativeType(type.item, addStack(context, "item"))) {
			if (part.atRoot) {
				root += part.content;
			} else {
				yield* writeContentAtRoot(`type ${name} []${part.content}`, 0, false);
			}
		}

		yield* writeContentAtRoot(root, 0, true);
	}
}
