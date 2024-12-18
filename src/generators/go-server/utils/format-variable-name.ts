import { camelCase, pascalCase, snakeCase } from "change-case";

export const formatVariableName = (
	name: string,
	type: "public" | "private" | "jsonKey" | "package",
) => {
	switch (type) {
		case "public":
			return pascalCase(name);
		case "jsonKey":
			return camelCase(name);
		case "private":
			return camelCase(name);
		case "package":
			return snakeCase(name);
	}
};
