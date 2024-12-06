import path from "node:path";
import { spinner, log } from "@clack/prompts";
import { glob } from "glob";

import { runtime } from "../../runtime.js";
import { IndexAction } from "../types/cli-commands/index.d.js";

export const indexAction: IndexAction = async (entries, options) => {
	if (entries.length === 0) {
		entries = glob.sync("**/*.unisp.ts", {
			ignore: ["node_modules/**"],
			nodir: true,
			dotRelative: true,
		});
	}

	if (entries.length === 0) {
		log.error("No Unisp files found");
		return;
	}

	const sp = spinner();
	sp.start();

	for (let entry of entries) {
		if (!entry.startsWith(".")) {
			entry = `./${entry}`;
		}

		const serviceName = path.basename(entry).split(".")[0];

		sp.message(`Generating ${serviceName}...`);

		const outputPath =
			entries.length === 1
				? options.output
				: path.join(options.output, serviceName);

		await runtime(entry, { outputPath });
	}

	sp.stop("Files generated successfully");
};
