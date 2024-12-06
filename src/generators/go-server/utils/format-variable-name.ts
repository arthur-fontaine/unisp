import { camelCase, pascalCase } from "change-case";

export const formatVariableName = (
	name: string,
	type: "public" | "private" | "jsonKey",
) => {
	switch (type) {
		case "public":
			return pascalCase(name);
		case "jsonKey":
			return camelCase(name);
		case "private":
			return camelCase(name);
	}
};
