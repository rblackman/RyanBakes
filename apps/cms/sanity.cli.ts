import { defineCliConfig } from "sanity/cli";

const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

export default defineCliConfig({
	api: {
		projectId: "t4mzu70v",
		dataset,
	},
});
