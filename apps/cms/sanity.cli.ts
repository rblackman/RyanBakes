import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
	api: {
		projectId: "t4mzu70v",
		dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
	},

	typegen: {
		// where to scan for GROQ queries
		path: [
			// CMS source
			"./schemas/**/*.{ts,tsx,js,jsx}",
			"./**/*.{ts,tsx,js,jsx}",

			// Website source (adjust if you use src/)
			"../website/app/**/*.{ts,tsx,js,jsx}",
			"../website/helpers/**/*.{ts,tsx,js,jsx}",
			"../website/hooks/**/*.{ts,tsx,js,jsx}",
			"../website/queries/**/*.{ts,tsx,js,jsx}",
			"../website/queries/**/*.{ts,tsx,js,jsx}",
			"../website/shared/**/*.{ts,tsx,js,jsx}",
			"../website/lib/**/*.{ts,tsx,js,jsx}",
		],

		// schema file produced by `sanity schema extract`
		schema: "./schema.json",

		// output file for generated types
		generates: "../../packages/sanity-types/sanity.types.ts",

		// optional; useful if you're using a typed client from `sanity.types.ts`
		overloadClientMethods: true,
	},
});
