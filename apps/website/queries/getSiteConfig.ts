import throwError from "@helpers/throw-error";
import type { SiteConfig } from "@ryan-bakes/sanity-types";
import { serverEnv } from "@shared/config/env.server";
import { sanityFetch } from "@shared/lib/live";
import { groq } from "@shared/lib/sanity";
import "server-only";

const siteConfigKey = serverEnv.SITE_CONFIG_KEY;
const siteConfigQuery = groq`*[_type == "siteConfig" && _id == $siteConfigKey][0]{...}`;

export default async function getSiteConfig(): Promise<SiteConfig> {
	const { data } = await sanityFetch({
		query: siteConfigQuery,
		params: { siteConfigKey },
		tags: ["siteConfig", `siteConfig:${siteConfigKey}`],
	});

	const siteConfig = data as SiteConfig | null;

	if (!siteConfig) {
		throwError(`Could not find a ${siteConfigKey}.`);
	}

	return siteConfig;
}
