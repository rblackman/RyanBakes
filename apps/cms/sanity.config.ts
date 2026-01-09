import { dashboardTool, projectInfoWidget, projectUsersWidget } from "@sanity/dashboard";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./schemas";
import { deskStructure } from "./structure";

const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

const previewOrigin = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://ryan-bakes.com";

export default defineConfig({
	name: "default",
	title: "Ryan Bakes",
	projectId: "t4mzu70v",
	dataset,

	plugins: [
		structureTool({ structure: deskStructure }),
		visionTool(),
		presentationTool({
			previewUrl: {
				initial: previewOrigin,
				previewMode: {
					enable: `${previewOrigin}/api/draft-mode/enable`,
					disable: `${previewOrigin}/api/draft-mode/disable`,
				},
			},
			allowOrigins: ["http://localhost:3000", "https://ryan-bakes.com"],
		}),
		dashboardTool({
			widgets: [projectInfoWidget(), projectUsersWidget()],
		}),
	],

	schema: {
		types: schemaTypes,
	},
});
