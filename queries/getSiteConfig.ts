import "server-only";
import { serverEnv } from "shared/config/env.server";
import type Query from "types/query";
import type { SiteConfig } from "types/sanity-schema";
import buildGroqQuery from "./lib/buildGroqQuery";
import nextFetch from "./lib/nextFetch";

const siteConfigKey = serverEnv.SITE_CONFIG_KEY;

export default async function getSiteConfig(): Promise<SiteConfig> {
	const url = buildGroqQuery(`*[ _id == '${siteConfigKey}' ]`);
	const response = await nextFetch(url);
	const { result } = (await response.json()) as Query<SiteConfig>;

	if (result.length === 0) {
		throw new Error(`Could not find a ${siteConfigKey}.`);
	}

	if (result.length > 1) {
		console.warn(`Got more than one ${siteConfigKey}. Using the first.`, {
			result,
		});
	}

	return result[0];
}
