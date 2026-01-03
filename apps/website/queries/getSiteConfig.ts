import throwError from "@helpers/throwError";
import type { SiteConfig } from "@ryan-bakes/sanity-types";
import "server-only";
import { serverEnv } from "@shared/config/env.server";
import { fetchSanity, groq } from "@shared/lib/sanity";

const siteConfigKey = serverEnv.SITE_CONFIG_KEY;
const siteConfigQuery = groq`*[_type == "siteConfig" && _id == $siteConfigKey][0]{...}`;

export default async function getSiteConfig(): Promise<SiteConfig> {
	const siteConfig = await fetchSanity<SiteConfig | null>(
		siteConfigQuery,
		{ siteConfigKey },
		{ revalidate: 300, tags: ["siteConfig", `siteConfig:${siteConfigKey}`] },
	);

	if (!siteConfig) {
		throwError(`Could not find a ${siteConfigKey}.`);
	}

	return siteConfig;
}
