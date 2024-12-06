import { TupleType } from "../../../schema/schema.js";
import { ExternalTypeBinding } from "../../../types/external-type-binding.js";
import { GenerateContext } from "../types.js";
import { addStack } from "../utils/add-stack.js";
import { getNativeType } from "../utils/get-native-type.js";
import { writeContent, writeContentAtRoot } from "../utils/write-content.js";

export class TuplePython extends ExternalTypeBinding<TupleType> {
	typeFromSchema = "tuple" as const;

	*getNativeType(type: TupleType, context: GenerateContext) {
		let code = `[`;
		let root = "\n";

		for (const [key, value] of Object.entries(type.elements)) {
			const nextContext = addStack(context, key);

			for (const part of getNativeType(value, nextContext)) {
				if (part.atRoot) {
					root += part.content;
				} else {
					code += `(${part.content}),`;
					code += "\n";
				}
			}
		}

		code += "]";

		yield* writeContent(code, 0);
		yield* writeContentAtRoot(root, 0, true);
	}
}
