import getSiteConfig from "@queries/live/getSiteConfig";
import { clientEnv } from "@shared/config/env.client";
import {
	defaultAuthorName,
	defaultSiteDescription,
	defaultSiteTitle,
	defaultTagline,
} from "@shared/config/site-defaults";
import { stegaClean } from "next-sanity";
import "server-only";

export type SiteInfo = Readonly<{
	title: string;
	tagline: string;
	description: string;
	/** Canonical origin with a trailing slash, e.g. https://ryan-bakes.com/ */
	baseUrl: string;
	/** BCP 47 language tag for <html lang> and JSON-LD, e.g. en-us. */
	lang: string;
	/** Open Graph locale, e.g. en_US. */
	locale: string;
	authorName: string;
}>;

/** "en-us" -> "en_US", "fr" -> "fr". */
export function toOpenGraphLocale(lang: string): string {
	const [language, region] = lang.split(/[-_]/);
	if (!language) {
		return "en_US";
	}

	return region ? `${language.toLowerCase()}_${region.toUpperCase()}` : language.toLowerCase();
}

/**
 * Site-wide values for metadata and structured data, with stega removed and empty fields filled from
 * `site-defaults`. The origin comes from NEXT_PUBLIC_BASE_URL, the same source as every canonical URL.
 */
export default async function getSiteInfo(): Promise<SiteInfo> {
	const config = await getSiteConfig();

	const title = stegaClean(config.title)?.trim() || defaultSiteTitle;
	const tagline = stegaClean(config.tagline)?.trim() || defaultTagline;
	const description = stegaClean(config.description)?.trim() || defaultSiteDescription;
	const lang = stegaClean(config.lang)?.trim() || "en";
	const baseUrl = new URL("/", clientEnv.NEXT_PUBLIC_BASE_URL).toString();

	return {
		title,
		tagline,
		description,
		baseUrl,
		lang,
		locale: toOpenGraphLocale(lang),
		authorName: defaultAuthorName,
	};
}
