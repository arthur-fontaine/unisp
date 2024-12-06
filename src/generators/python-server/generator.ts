import dedent from "dedent";
import { httpSpec } from "../../specs/http-spec.js";
import type { Generator } from "../../types/generator.js";
import { Generate, GenerateContext, HttpSpec } from "./types.js";
import { addStack } from "./utils/add-stack.js";
import { getNativeType } from "./utils/get-native-type.js";
import { writeContentAtRoot } from "./utils/write-content.js";

export class PythonServerGenerator implements Generator<typeof httpSpec> {
	generate: Generate = (context) => {
		let root = "";
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
      from __future__ import annotations
      from typing import Tuple, TypedDict, Callable, Awaitable, Optional, NotRequired
      import json
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
		return `${context.stackNames.join("_")}Request`;
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
		return `${context.stackNames.join("_")}Response`;
	}

	private *generateService(context: GenerateContext) {
		const fileName = context.filePath.split("/").pop()!.split(".")[0];
		const serviceName = `${fileName}_service`;

		// function signature
		yield* writeContentAtRoot(`def create_${serviceName}(*,\n`, 0, true);

		// function parameters
		for (const name in context.specs) {
			const nextContext = addStack(context, name);
			const requestTypeName = this.getRequestTypeName(nextContext);
			const responseTypeName = this.getResponseTypeName(nextContext);

			yield* writeContentAtRoot(
				`${name}: Callable[[${requestTypeName}], Awaitable[${responseTypeName}]],\n`,
				1,
				true,
			);
		}

		yield { atRoot: true, content: `):\n` };

		const middlewareName = `${fileName}_middleware`;
		let middlewareCode = /* py */ `
      class ${middlewareName}:
        def __init__(self, app):
          self.app = app

        async def __call__(self, scope, receive, send):
          if scope['type'] == 'http':
            path = scope['path']

            async def _get_body():
              body = b''
              while True:
                message = await receive()
                if message['type'] == 'http.request':
                  body += message.get('body', b'')
                  if not message.get('more_body', False):
                    return body

            async def _send_response(body):
              await send({ "type": "http.response.start", "status": 200, "headers": [(b"content-type", b"application/json")] })
              await send({ "type": "http.response.body", "body": str.encode(json.dumps(body)), "more_body": False })
    \n            `;
		for (const [name, spec] of Object.entries(context.specs)) {
			middlewareCode += `if path == '${spec.path}':
              await _send_response(await ${name}(await _get_body()))
              return
            el`;
		}
		middlewareCode += `se:
              pass

            await self.app(scope, receive, send)\n`;

		yield* writeContentAtRoot(dedent(middlewareCode), 1, true);
		yield* writeContentAtRoot(`return ${middlewareName}`, 1);
	}
}
