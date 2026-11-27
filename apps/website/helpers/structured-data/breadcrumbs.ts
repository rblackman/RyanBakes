import type { JsonLdBreadcrumbList, JsonLdListItem } from "./types";

export type Crumb = Readonly<{
	name: string;
	/** Absolute URL. The last crumb (the current page) may leave it out, as Google allows. */
	url?: string | undefined;
}>;

/**
 * Builds a schema.org BreadcrumbList from the trail of pages above the current one, home first.
 * Crumbs with an empty name are dropped; returns undefined when fewer than two remain, since a
 * one-item trail tells search engines nothing.
 */
export default function buildBreadcrumbJsonLd(crumbs: ReadonlyArray<Crumb>): JsonLdBreadcrumbList | undefined {
	const named = crumbs.map(({ name, url }) => ({ name: name.trim(), url })).filter(({ name }) => name.length > 0);

	if (named.length < 2) {
		return undefined;
	}

	const itemListElement = named.map(({ name, url }, index): JsonLdListItem => {
		return {
			"@type": "ListItem",
			position: index + 1,
			name,
			...(url ? { item: url } : {}),
		};
	});

	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement,
	};
}
