import type { JsonLdWebSite } from "./types";

type Input = Readonly<{
	name: string;
	url: string;
	description?: string | undefined;
	lang?: string | undefined;
	alternateName?: string | undefined;
}>;

/**
 * Builds the schema.org WebSite object for the home page. Google uses it to pick the site name shown
 * in search results. There is no site search, so no SearchAction is added.
 */
export default function buildWebSiteJsonLd({ name, url, description, lang, alternateName }: Input): JsonLdWebSite {
	const trimmedDescription = description?.trim();
	const trimmedAlternate = alternateName?.trim();

	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": `${url}#website`,
		name,
		url,
		...(trimmedAlternate && trimmedAlternate !== name ? { alternateName: trimmedAlternate } : {}),
		...(trimmedDescription ? { description: trimmedDescription } : {}),
		...(lang ? { inLanguage: lang } : {}),
	};
}
