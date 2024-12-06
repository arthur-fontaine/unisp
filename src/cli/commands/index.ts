import { createCommand } from "commander";
import { indexAction } from "../actions/index.js";

export const indexCommand = createCommand("generate")
	.description("run the specified generators")
	.argument("[entries...]", "entry files", [])
	.option("-o, --output <dir>", "output directory", "output")
	.action(indexAction);
