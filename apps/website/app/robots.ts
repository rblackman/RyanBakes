import getSiteInfo from "@shared/lib/site-info";
import type { MetadataRoute } from "next";
import "server-only";

/**
 * /robots.txt: crawl everything except the API routes (webhooks and draft mode) and the /studio
 * redirect, and point to the sitemap. Single recipes opt out with their own robots meta tag
 * ("Hide from search engines" in the Studio). Vercel adds a noindex header to preview deployments.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
	const { baseUrl } = await getSiteInfo();

	return {
		rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/studio"] }],
		sitemap: new URL("/sitemap.xml", baseUrl).toString(),
		host: baseUrl,
	};
}
