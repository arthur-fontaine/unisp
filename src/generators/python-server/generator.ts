import { httpSpec } from "../../specs/http-spec.js";
import type { Generator } from "../../types/generator.js";
import { Generate, GenerateContext, HttpSpec } from "./types.js";
import { getNativeType } from "./utils/get-native-type.js";

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
		yield {
			atRoot: true,
			content: "from typing import Tuple, TypedDict, Callable, Awaitable\n",
		};
		yield { atRoot: true, content: "import json\n" };
		yield { atRoot: true, content: "\n" };
	}

	private *generateSpecs(context: GenerateContext) {
		for (const [name, spec] of Object.entries(context.specs)) {
			yield* this.generateSpec(
				{
					...context,
					stackNames: [...context.stackNames, name],
				},
				spec,
			);
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
		let code = "";

		code += `type ${this.getRequestTypeName(context)} = Tuple[\n`;
		for (let i = 0; i < request.length; i++) {
			const type = request[i];
			code += "  ";
			for (const part of getNativeType(type, {
				...context,
				stackNames: [...context.stackNames, "request", i.toString()],
			})) {
				if (part.atRoot) {
					yield part;
				} else {
					code += part.content;
				}
			}
			code += ",\n";
		}
		code += `]\n\n`;

		yield { atRoot: true, content: code };
	}

	private getRequestTypeName(context: GenerateContext) {
		return `${context.stackNames.join("_")}Request`;
	}

	private *generateResponseType(
		context: GenerateContext,
		response: HttpSpec["response"],
	) {
		let code = "";

		code += `type ${this.getResponseTypeName(context)} = `;

		for (const part of getNativeType(response, {
			...context,
			stackNames: [...context.stackNames, "response"],
		})) {
			if (part.atRoot) {
				yield part;
			} else {
				code += part.content;
			}
		}

		code += "\n\n";

		yield { atRoot: true, content: code };
	}

	private getResponseTypeName(context: GenerateContext) {
		return `${context.stackNames.join("_")}Response`;
	}

	private *generateService(context: GenerateContext) {
		const fileName = context.filePath.split("/").pop()!.split(".")[0];
		const serviceName = `${fileName}_service`;

		yield { atRoot: true, content: `def create_${serviceName}(*,\n` };

		for (const [name, spec] of Object.entries(context.specs)) {
			yield {
				atRoot: true,
				content: `  ${name}: Callable[[*${this.getRequestTypeName({
					...context,
					stackNames: [...context.stackNames, name],
				})}], Awaitable[${this.getResponseTypeName({
					...context,
					stackNames: [...context.stackNames, name],
				})}]],\n`,
			};
		}

		yield { atRoot: true, content: `):\n` };

		const middlewareName = `${fileName}_middleware`;
		yield { atRoot: true, content: `  class ${middlewareName}:\n` };
		yield { atRoot: true, content: `    def __init__(self, app):\n` };
		yield { atRoot: true, content: `      self.app = app\n` };
		yield { atRoot: true, content: `\n` };
		yield {
			atRoot: true,
			content: `    async def __call__(self, scope, receive, send):\n`,
		};
		yield { atRoot: true, content: `      if scope['type'] == 'http':\n` };
		yield { atRoot: true, content: `        path = scope['path']\n` };
		yield { atRoot: true, content: `        async def _get_body():\n` };
		yield { atRoot: true, content: `          body = b''\n` };
		yield { atRoot: true, content: `          while True:\n` };
		yield { atRoot: true, content: `            message = await receive()\n` };
		yield {
			atRoot: true,
			content: `            if message['type'] == 'http.request':\n`,
		};
		yield {
			atRoot: true,
			content: `              body += message.get('body', b'')\n`,
		};
		yield {
			atRoot: true,
			content: `              if not message.get('more_body', False):\n`,
		};
		yield { atRoot: true, content: `                return body\n` };
		yield {
			atRoot: true,
			content: "        async def _send_response(body):\n",
		};
		yield {
			atRoot: true,
			content:
				'          await send({ "type": "http.response.start", "status": 200, "headers": [(b"content-type", b"application/json")] })\n',
		};
		yield {
			atRoot: true,
			content:
				'          await send({ "type": "http.response.body", "body": str.encode(json.dumps(body)), "more_body": False })\n',
		};
		yield { atRoot: true, content: "        " };
		for (const [name, spec] of Object.entries(context.specs)) {
			yield { atRoot: true, content: `if path == '${spec.path}':\n` };
			yield {
				atRoot: true,
				content: `          await _send_response(await ${name}(await _get_body()))\n`,
			};
			yield { atRoot: true, content: `          return\n` };
			yield { atRoot: true, content: "        el" };
		}
		yield { atRoot: true, content: "se:\n" };
		yield { atRoot: true, content: "          pass\n" };
		yield {
			atRoot: true,
			content: "      await self.app(scope, receive, send)",
		};
		yield { atRoot: true, content: `\n` };
		yield { atRoot: true, content: `  return ${middlewareName}\n\n` };
	}
}
