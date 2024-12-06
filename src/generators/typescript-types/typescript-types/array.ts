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

		const innerArrayTypes: string[] = [];
		for (const [key, value] of Object.entries(type.elements)) {
			const nextContext = addStack(context, key);

			for (const part of getNativeType(value, nextContext)) {
				if (part.atRoot) {
					root += part.content;
				} else {
					innerArrayTypes.push(`(${part.content})`);
				}
			}
		}

		yield* writeContent(`(${innerArrayTypes.join(" | ")})[]`, 0);
		yield* writeContentAtRoot(root, 0, true);
	}
}
