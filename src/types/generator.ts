import { BaseSpec } from "../specs/base-spec.js";

export interface GenerateContext<
	T extends BaseSpec<any, any> = BaseSpec<any, any>,
> {
	filePath: string;
	stackNames: string[];
	specs: {
		[k: string]: ReturnType<T>;
	};
	params: {
		basePath?: string;
	};
}

export interface Generator<T extends BaseSpec<any, any>> {
	outputPath: string;
	generate(context: GenerateContext<T>): string;
}
