import { BaseSpec } from "../specs/base-spec.js";

export interface GenerateContext<
	T extends BaseSpec<any, any> = BaseSpec<any, any>,
> {
	filePath: string;
	stackNames: string[];
	specs: {
		[k: string]: ReturnType<T>;
	};
}

export interface Generator<T extends BaseSpec<any, any>> {
	generate(context: GenerateContext<T>): string;
}
