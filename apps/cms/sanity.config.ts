import { dashboardTool, projectInfoWidget, projectUsersWidget } from "@sanity/dashboard";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./schemas";
import { deskStructure } from "./structure";

const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

export default defineConfig({
	name: "default",
	title: "Ryan Bakes",
	projectId: "t4mzu70v",
	dataset,

	plugins: [
		structureTool({ structure: deskStructure }),
		visionTool(),
		dashboardTool({
			widgets: [projectInfoWidget(), projectUsersWidget()],
		}),
	],

	schema: {
		types: schemaTypes,
	},
});
