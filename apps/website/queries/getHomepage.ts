import throwError from "@helpers/throwError";
import type { Page } from "@ryan-bakes/sanity-types";
import "server-only";
import getPageById from "./getPageById";
import getSiteConfig from "./getSiteConfig";

export default async function getHomepage(): Promise<Page> {
	const siteConfig = await getSiteConfig();

	const ref = siteConfig.homepage?._ref;
	if (!ref) {
		throwError("SiteConfig.homepage is not set (missing reference).");
	}

	return await getPageById(ref);
}
