import { ArrayType } from "../../../schema/schema.js";
import { ExternalTypeBinding } from "../../../types/external-type-binding.js";
import { GenerateContext } from "../types.js";
import { addStack } from "../utils/add-stack.js";
import { getNativeType } from "../utils/get-native-type.js";
import { writeContent, writeContentAtRoot } from "../utils/write-content.js";

export class ArrayPython extends ExternalTypeBinding<ArrayType> {
	typeFromSchema = "array" as const;

	*getNativeType(type: ArrayType, context: GenerateContext) {
		let root = "\n";

		let innerArrayTypes: string = "";
		const nextContext = addStack(context, "item");

		for (const part of getNativeType(type.item, nextContext)) {
			if (part.atRoot) {
				root += part.content;
			} else {
				innerArrayTypes += part.content;
			}
		}

		yield* writeContent(`(${innerArrayTypes})[]`, 0);
		yield* writeContentAtRoot(root, 0, true);
	}
}
