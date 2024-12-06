import { camelCase, pascalCase } from "change-case";

export const formatVariableName = (name: string, type: "type" | "variable") => {
	switch (type) {
		case "type":
			return pascalCase(name);
		case "variable":
			return camelCase(name);
	}
};
