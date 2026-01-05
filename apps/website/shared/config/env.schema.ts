import { z } from "zod";

export const ClientEnvSchema = z.object({
	NEXT_PUBLIC_BASE_URL: z.url(),
	NEXT_PUBLIC_SANITY_KEY: z.string().length(8),
	NEXT_PUBLIC_SANITY_DATASET: z.string().default("production"),
	NEXT_PUBLIC_SANITY_STUDIO_URL: z.string().url(),
});

export const ServerEnvSchema = z.object({
	RECIPES_PAGE_KEY: z.string().min(1),
	TAGS_PAGE_KEY: z.string().min(1),
	SITE_CONFIG_KEY: z.string().min(1),
	SANITY_REVALIDATE_SECRET: z.string().min(1),
	SANITY_VIEWER_TOKEN: z.string().min(1),
});
