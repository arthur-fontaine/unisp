import { snakeCase, pascalCase, camelCase } from "change-case";

export const formatVariableName = (
	name: string,
	type: "class" | "type" | "variable" | "function" | "jsonKey",
) => {
	switch (type) {
		case "type":
		case "class":
			return pascalCase(name);
		case "jsonKey":
			return camelCase(name);
		default:
			return snakeCase(name);
	}
};
