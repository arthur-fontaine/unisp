import dedent from "dedent";
import { httpSpec } from "../../specs/http-spec.js";
import type { Generator } from "../../types/generator.js";
import { Generate, GenerateContext, HttpSpec } from "./types.js";
import { addStack } from "./utils/add-stack.js";
import { getNativeType } from "./utils/get-native-type.js";
import { writeContentAtRoot } from "./utils/write-content.js";
import { formatVariableName } from "./utils/format-variable-name.js";

export class GoServerGenerator implements Generator<typeof httpSpec> {
	generate: Generate = (context) => {
		const fileName = context.filePath.split("/").pop()!.split(".")[0];

		let root = `package ${fileName}\n\n`;
		let code = "";

		const generators = [
			this.generateImports.bind(this),
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

	private *generateImports() {
		yield* writeContentAtRoot(
			dedent`
      import (
        "net/http"
        "encoding/json"
      )
    `,
			0,
			true,
		);
	}

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
		let requestTypeCode = `type ${this.getRequestTypeName(context)} `;
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
			formatVariableName(`${context.stackNames.join("_")}Request`, "public") +
			"_"
		);
	}

	private *generateResponseType(
		context: GenerateContext,
		response: HttpSpec["response"],
	) {
		let responseTypeCode = "";

		responseTypeCode += `type ${this.getResponseTypeName(context)} `;

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
			formatVariableName(`${context.stackNames.join("_")}Response`, "public") +
			"_"
		);
	}

	private *generateService(context: GenerateContext) {
		const fileName = context.filePath.split("/").pop()!.split(".")[0];
		const serviceName = formatVariableName(`${fileName}Service`, "public");

		yield* writeContentAtRoot(
			`
      type ${serviceName} interface {
        ${Object.keys(context.specs)
					.map((name) => {
						const nextContext = addStack(context, name);
						const requestTypeName = this.getRequestTypeName(nextContext);
						const responseTypeName = this.getResponseTypeName(nextContext);

						return `${formatVariableName(name, "public")}(req ${requestTypeName}) ${responseTypeName}`;
					})
					.join("\n")}
      }
    `,
			0,
			true,
		);

		yield* writeContentAtRoot(
			`
      func Create${serviceName}Middleware(service ${serviceName}) func(next http.Handler) http.Handler {
        return func(next http.Handler) http.Handler {
          return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            path := r.URL.Path
            method := r.Method

            ${Object.keys(context.specs)
							.map((name) => {
								return `if path == "${context.specs[name].path}" && method == "${context.specs[name].method}" {
                req := ${this.getRequestTypeName(addStack(context, name))}{}
                if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
                  http.Error(w, err.Error(), http.StatusBadRequest)
                  return
                }

                res := service.${formatVariableName(name, "public")}(req)
                resBody, _ := json.Marshal(res)

                w.Header().Set("Content-Type", "application/json")
                w.Write(resBody)

                return
              }`;
							})
							.join("\n")}
          })
        }
      }`,
			0,
			true,
		);
	}
}
