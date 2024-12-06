import { camelCase, pascalCase } from "change-case";

export const formatVariableName = (
	name: string,
	type: "type" | "variable" | "jsonKey",
) => {
	switch (type) {
		case "type":
			return pascalCase(name);
		case "jsonKey":
			return camelCase(name);
		case "variable":
			return camelCase(name);
	}
};
