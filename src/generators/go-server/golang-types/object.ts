import { ObjectType } from "../../../schema/schema.js";
import { ExternalTypeBinding } from "../../../types/external-type-binding.js";
import { GenerateContext } from "../types.js";
import { addStack } from "../utils/add-stack.js";
import { formatVariableName } from "../utils/format-variable-name.js";
import { getNativeType } from "../utils/get-native-type.js";
import { writeContent, writeContentAtRoot } from "../utils/write-content.js";

export class ObjectPython extends ExternalTypeBinding<ObjectType> {
	typeFromSchema = "object" as const;

	*getNativeType(type: ObjectType, context: GenerateContext) {
		const name = formatVariableName(context.stackNames.join("_"), "private");

		yield* writeContentAtRoot(`type ${name} struct {\n`, 0, true);
		yield* writeContent(name, 0);

		for (const [key, value] of Object.entries(type.properties)) {
			let code = `  ${formatVariableName(key, "public")} `;
			let root = "\n";
			const nextContext = addStack(context, key);

			for (const part of getNativeType(value, nextContext)) {
				if (part.atRoot) {
					root += part.content;
				} else {
					code +=
						part.content + ` \`json:"${formatVariableName(key, "jsonKey")}"\``;
				}
			}
			code += "}\n";

			yield* writeContentAtRoot(code, 1, true);
			yield* writeContentAtRoot(root, 0, true);
		}
	}
}
