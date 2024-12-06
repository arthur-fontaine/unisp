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

		yield* writeContentAtRoot(`type ${name} = list[`, 0, true);
		yield* writeContent(name, 0);

		const typeNames: string[] = [];
		let root = "\n";

		for (const [index, value] of Object.entries(type.elements)) {
			for (const part of getNativeType(value, addStack(context, index))) {
				if (part.atRoot) {
					root += part.content;
				} else {
					typeNames.push(`(${part.content})`);
				}
			}
		}

		yield* writeContentAtRoot(`${typeNames.join(" | ")}\n\r]`, 1, true);
		yield* writeContentAtRoot(root, 0, true);
	}
}