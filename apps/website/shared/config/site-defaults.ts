/**
 * Fallback copy used when the matching `siteConfig` field in Sanity is empty.
 * Editors should fill in the Sanity fields; these keep the site readable until they do.
 */
export const defaultSiteTitle = "Ryan Bakes";

export const defaultTagline = "Recipes from Ryan's kitchen";

export const defaultSiteDescription =
	"Ryan's recipes for bread, pizza, weeknight dinners and more, with exact amounts and step-by-step instructions.";

/**
 * The author named in recipe structured data (schema.org Recipe `author`). There is no author field in
 * Sanity yet, so every recipe uses this name.
 */
export const defaultAuthorName = "Ryan";
