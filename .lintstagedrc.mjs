// ./.lintstagedrc.mjs
import path from "node:path";

const quote = (p) => `"${p}"`;

const toRepoRelative = (filenames) =>
	filenames.map((f) => path.relative(process.cwd(), f)).map((f) => f.split(path.sep).join("/"));

const isIgnored = (f) =>
	f.startsWith("packages/sanity-types/") ||
	f.includes("/.next/") ||
	f.includes("/dist/") ||
	f.includes("/build/") ||
	f.includes("/out/") ||
	f.includes("/coverage/");

const biomeCheck = (filenames) => {
	const files = toRepoRelative(filenames)
		.filter((f) => !isIgnored(f))
		.map(quote)
		.join(" ");

	if (!files) return 'node -e "process.exit(0)"';

	return `pnpm -w exec biome check --write --no-errors-on-unmatched --files-ignore-unknown=true --colors=off ${files}`;
};

export default {
	// Typecheck the website project when TS/TSX files are staged.
	"**/*.{ts,tsx}": () => "pnpm -w exec tsc -p apps/website/tsconfig.json --noEmit",

	// Repo-wide lint/format for staged files (skip generated output)
	"**/*.{js,jsx,ts,tsx,md,json}": biomeCheck,
};
