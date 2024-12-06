#!/usr/bin/env node

import { program } from "commander";
import packageJson from "../../package.json" with { type: "json" };
import { indexCommand } from "./commands/index.js";

program
	.description(packageJson.description)
	.addCommand(indexCommand, { isDefault: true })
	.allowExcessArguments(false)
	.allowUnknownOption(false)
	.helpOption(true)
	.showHelpAfterError(true);

program.parse();
