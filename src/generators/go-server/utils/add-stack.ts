import { GenerateContext } from "../types.js";

export function addStack(
	context: GenerateContext,
	...stackNames: string[]
): GenerateContext {
	return {
		...context,
		stackNames: [...context.stackNames, ...stackNames],
	};
}
