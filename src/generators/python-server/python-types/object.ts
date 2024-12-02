import { ObjectType } from "../../../schema/schema.js";
import { ExternalTypeBinding } from "../../../types/external-type-binding.js";
import { GenerateContext } from "../types.js";
import { getNativeType } from "../utils/get-native-type.js";

export class ObjectPython extends ExternalTypeBinding<ObjectType> {
	typeFromSchema = "object" as const;

	*getNativeType(type: ObjectType, context: GenerateContext) {
		const name = context.stackNames.join("_");

		yield { atRoot: true, content: `class ${name}(TypedDict):\n` };
		yield { atRoot: false, content: name };

		for (const [key, value] of Object.entries(type.properties)) {
			let code = `  ${key}: `;
			let root = "\n";
			for (const part of getNativeType(value, {
				...context,
				stackNames: [...context.stackNames, key],
			})) {
				if (part.atRoot) {
					root += part.content;
				} else {
					code += part.content;
				}
			}
			code += "\n";

			yield { atRoot: true, content: code };
			yield { atRoot: true, content: root };
		}
	}
}
