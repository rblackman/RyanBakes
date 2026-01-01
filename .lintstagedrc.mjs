// ./.lintstagedrc.mjs
import path from "node:path";

const quote = (p) => `"${p}"`;

const toRepoRelative = (filenames) => {
	return filenames.map((f) => path.relative(process.cwd(), f)).map((f) => f.split(path.sep).join("/"));
};

const isIgnored = (f) => {
	return (
		f.startsWith("packages/sanity-types/") ||
		f.includes("/.next/") ||
		f.includes("/dist/") ||
		f.includes("/build/") ||
		f.includes("/out/") ||
		f.includes("/coverage/")
	);
};

const biomeCheck = (filenames) => {
	const files = toRepoRelative(filenames)
		.filter((f) => {
			return !isIgnored(f);
		})
		.map(quote)
		.join(" ");

	if (!files) {
		return 'node -e "process.exit(0)"';
	}

	return `pnpm -w exec biome check --write --no-errors-on-unmatched --files-ignore-unknown=true --colors=off ${files}`;
};

const stagedFilesUnder = (filenames, prefix) => {
	return (
		toRepoRelative(filenames).filter((f) => {
			return !isIgnored(f) && f.startsWith(prefix);
		}).length > 0
	);
};

export default {
	// Typecheck website if any website TS/TSX files are staged
	"**/*.{ts,tsx}": (filenames) => {
		const cmds = [];

		if (stagedFilesUnder(filenames, "apps/website/")) {
			cmds.push("pnpm -w exec tsc -p apps/website/tsconfig.json --noEmit");
		}

		if (stagedFilesUnder(filenames, "apps/cms/")) {
			cmds.push("pnpm -w exec tsc -p apps/cms/tsconfig.json --noEmit");
		}

		// If TS/TSX staged but none under website/cms (rare), do nothing.
		if (cmds.length === 0) {
			cmds.push('node -e "process.exit(0)"');
		}

		return cmds;
	},

	// Format/lint staged files (skip generated output)
	"**/*.{js,jsx,ts,tsx,md,json}": biomeCheck,
};
