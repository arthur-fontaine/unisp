import { ObjectType } from "../../../schema/schema.js";
import { ExternalTypeBinding } from "../../../types/external-type-binding.js";
import { GenerateContext } from "../types.js";
import { addStack } from "../utils/add-stack.js";
import { formatVariableName } from "../utils/format-variable-name.js";
import { getNativeType } from "../utils/get-native-type.js";
import { writeContent } from "../utils/write-content.js";

export class ObjectPython extends ExternalTypeBinding<ObjectType> {
	typeFromSchema = "object" as const;

	*getNativeType(type: ObjectType, context: GenerateContext) {
		yield* writeContent("{", 0, true);
		for (const [key, value] of Object.entries(type.properties)) {
			const nextContext = addStack(context, key);
			yield* writeContent(formatVariableName(key, "jsonKey"), 1);
			if (value.type === "optional") {
				yield* writeContent("?", 0);
			}
			yield* writeContent(":", 0);
			yield* getNativeType(value, nextContext);
		}
		yield* writeContent("", 0, true);
		yield* writeContent("}", 0, true);
	}
}
