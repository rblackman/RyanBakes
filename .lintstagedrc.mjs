import { relative } from "node:path";

const buildBiomeCommand = (filenames) => {
	const files = filenames.map((f) => relative(process.cwd(), f)).join(" ");

	return `pnpm exec biome check --write --no-errors-on-unmatched --files-ignore-unknown=true --colors=off ${files}`;
};

export default {
	// Typecheck TS/TSX before commit (same as before)
	"**/*.{ts,tsx}": () => "pnpm exec tsc --noEmit",

	// Use Biome for lint+format on code & text files
	"**/*.{js,jsx,ts,tsx,md,json}": buildBiomeCommand,
};
