import Block from "@components/features/content-blocks/block";
import JsonLd from "@components/ui/json-ld";
import buildPageMetadata from "@helpers/page-metadata";
import buildWebSiteJsonLd from "@helpers/structured-data/website";
import getHomepage from "@queries/live/getHomepage";
import getSiteConfig from "@queries/live/getSiteConfig";
import getTagSummaries from "@queries/live/getTagSummaries";
import type { InlineImage, RecipePreview, TextSection } from "@ryan-bakes/sanity-types";
import { defaultSiteDescription, defaultTagline } from "@shared/config/site-defaults";
import getSiteInfo from "@shared/lib/site-info";
import type Keyed from "@t/keyed";
import type { Metadata } from "next";
import { stegaClean } from "next-sanity";
import "server-only";
import BrowseByTag from "./features/browse-by-tag";
import HomeHero from "./features/home-hero";

export async function generateMetadata(): Promise<Metadata> {
	const site = await getSiteInfo();

	// The home page leads with the site name, then the tagline: "Ryan Bakes | Recipes from Ryan's kitchen".
	return buildPageMetadata({
		site,
		title: `${site.title} | ${site.tagline}`,
		absoluteTitle: true,
		description: site.description,
		path: "/",
	});
}

export default async function Page() {
	const [{ content }, siteConfig, tagSummaries, site] = await Promise.all([
		getHomepage(),
		getSiteConfig(),
		getTagSummaries(),
		getSiteInfo(),
	]);
	const blocks: Array<Keyed<InlineImage | TextSection | RecipePreview>> = content ?? [];
	// On phones the first large recipe preview's photo fills the screen width, so it is usually the
	// largest thing in view. Fetch it early instead of lazily.
	const leadPreviewKey = blocks.find((block) => block._type === "recipePreview" && block.large === true)?._key;

	// Keep the raw (possibly stega-encoded) values so visual editing can map them to fields.
	// Check emptiness on cleaned values, since stega characters survive trim().
	const { tagline: rawTagline, description: rawDescription } = siteConfig;
	const tagline = rawTagline && stegaClean(rawTagline).trim() ? rawTagline : defaultTagline;
	const description = rawDescription && stegaClean(rawDescription).trim() ? rawDescription : defaultSiteDescription;

	const webSiteJsonLd = buildWebSiteJsonLd({
		name: site.title,
		url: site.baseUrl,
		description: site.description,
		lang: site.lang,
	});

	return (
		<div className="content">
			<JsonLd data={webSiteJsonLd} />
			<HomeHero tagline={tagline} description={description} />

			{blocks.map((block) => (
				<Block key={block._key} content={block} priority={block._key === leadPreviewKey} />
			))}

			<BrowseByTag summaries={tagSummaries} />
		</div>
	);
}
