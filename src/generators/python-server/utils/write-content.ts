import dedent from "dedent";

function* _writeContent(
	content: string,
	atRoot: boolean,
	indent: number,
	newLineAtEnd: boolean,
) {
	content = dedent(content)
		.split("\n")
		.map((line) => "  ".repeat(indent) + line)
		.join("\n");
	content += newLineAtEnd ? "\n" : "";

	yield { atRoot, content };
}

export function* writeContentAtRoot(
	content: string,
	indent: number,
	newLineAtEnd: boolean = false,
) {
	yield* _writeContent(content, true, indent, newLineAtEnd);
}

export function* writeContent(
	content: string,
	indent: number,
	newLineAtEnd: boolean = false,
) {
	yield* _writeContent(content, false, indent, newLineAtEnd);
}
