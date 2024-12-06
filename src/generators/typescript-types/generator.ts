import { httpSpec } from "../../specs/http-spec.js";
import type { Generator } from "../../types/generator.js";
import { Generate, GenerateContext, HttpSpec } from "./types.js";
import { addStack } from "./utils/add-stack.js";
import { formatVariableName } from "./utils/format-variable-name.js";
import { getNativeType } from "./utils/get-native-type.js";
import { writeContentAtRoot } from "./utils/write-content.js";

export class TypeScriptTypesGenerator implements Generator<typeof httpSpec> {
	generate: Generate = (context) => {
		let root = "";
		let code = "";

		const generators = [
			this.generateSpecs.bind(this),
			this.generateService.bind(this),
		];

		for (const generator of generators) {
			for (const part of generator(context)) {
				if (part.atRoot) {
					root += part.content;
				} else {
					code += part.content;
				}
			}
		}

		return `${root}\n${code}`;
	};

	private *generateSpecs(context: GenerateContext) {
		for (const [name, spec] of Object.entries(context.specs)) {
			yield* this.generateSpec(addStack(context, name), spec);
		}
	}

	private *generateSpec(context: GenerateContext, spec: HttpSpec) {
		yield* this.generateRequestType(context, spec.request);
		yield* this.generateResponseType(context, spec.response);
	}

	private *generateRequestType(
		context: GenerateContext,
		request: HttpSpec["request"],
	) {
		let requestTypeCode = `type ${this.getRequestTypeName(context)} = `;
		for (const part of getNativeType(request, addStack(context, "request"))) {
			if (part.atRoot) {
				yield part;
			} else {
				requestTypeCode += part.content;
			}
		}

		yield* writeContentAtRoot(requestTypeCode, 0, true);
	}

	private getRequestTypeName(context: GenerateContext) {
		return (
			formatVariableName(`${context.stackNames.join("_")}Request`, "type") + "_"
		);
	}

	private *generateResponseType(
		context: GenerateContext,
		response: HttpSpec["response"],
	) {
		let responseTypeCode = "";

		responseTypeCode += `type ${this.getResponseTypeName(context)} = `;

		for (const part of getNativeType(response, addStack(context, "response"))) {
			if (part.atRoot) {
				yield part;
			} else {
				responseTypeCode += part.content;
			}
		}

		yield* writeContentAtRoot(responseTypeCode, 0, true);
	}

	private getResponseTypeName(context: GenerateContext) {
		return (
			formatVariableName(`${context.stackNames.join("_")}Response`, "type") +
			"_"
		);
	}

	private *generateService(context: GenerateContext) {
		const fileName = context.filePath.split("/").pop()!.split(".")[0];
		const serviceName = formatVariableName(`${fileName}Service`, "type");

		yield* writeContentAtRoot(`export interface ${serviceName} {\n`, 0, true);
		for (const name in context.specs) {
			const nextContext = addStack(context, name);
			const requestTypeName = this.getRequestTypeName(nextContext);
			const responseTypeName = this.getResponseTypeName(nextContext);

			yield* writeContentAtRoot(
				`${formatVariableName(name, "variable")}(request: ${requestTypeName}): Promise<${responseTypeName}>;\n`,
				1,
				true,
			);
		}
		yield* writeContentAtRoot(`}\n`, 0, true);
	}
}
