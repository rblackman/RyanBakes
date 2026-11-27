/**
 * Documents that exist exactly once, opened by a fixed ID. The website finds them through the
 * SITE_CONFIG_KEY, TAGS_PAGE_KEY and RECIPES_PAGE_KEY environment variables, so the IDs must not change.
 */
export const singletons = [
	{ type: "siteConfig", id: "siteConfig", title: "Global Settings" },
	{ type: "recipesPage", id: "recipesPage", title: "Recipes Page" },
	{ type: "tagsPage", id: "tagsPage", title: "Tags Page" },
] as const;

export const singletonTypes: ReadonlySet<string> = new Set(singletons.map(({ type }) => type));
