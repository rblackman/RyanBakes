import Block from "@components/features/content-blocks/block";
import buildCanonicalUrl from "@helpers/build-canonical-url";
import getHomepage from "@queries/live/getHomepage";
import getSiteConfig from "@queries/live/getSiteConfig";
import getTagSummaries from "@queries/live/getTagSummaries";
import type { InlineImage, RecipePreview, TextSection } from "@ryan-bakes/sanity-types";
import { defaultSiteDescription, defaultTagline } from "@shared/config/site-defaults";
import type Keyed from "@t/keyed";
import type { Metadata } from "next";
import { stegaClean } from "next-sanity";
import "server-only";
import BrowseByTag from "./features/browse-by-tag";
import HomeHero from "./features/home-hero";

const homeCanonical = buildCanonicalUrl("/");
const homeTitle = "Home";

export async function generateMetadata(): Promise<Metadata> {
	const { description } = await getSiteConfig();
	const homeDescription = stegaClean(description)?.trim() || defaultSiteDescription;

	return {
		title: homeTitle,
		description: homeDescription,
		alternates: homeCanonical ? { canonical: homeCanonical } : undefined,
		openGraph: {
			title: homeTitle,
			description: homeDescription,
			...(homeCanonical ? { url: homeCanonical } : {}),
		},
		twitter: {
			card: "summary_large_image",
			title: homeTitle,
			description: homeDescription,
		},
	};
}

export default async function Page() {
	const [{ content }, siteConfig, tagSummaries] = await Promise.all([
		getHomepage(),
		getSiteConfig(),
		getTagSummaries(),
	]);
	const blocks: Array<Keyed<InlineImage | TextSection | RecipePreview>> = content ?? [];
	// The first large recipe preview's photo is near the top and often the largest thing in view on
	// wider screens. Fetch it early instead of lazily.
	const leadPreviewKey = blocks.find((block) => block._type === "recipePreview" && block.large === true)?._key;

	// Keep the raw (possibly stega-encoded) values so visual editing can map them to fields.
	// Check emptiness on cleaned values, since stega characters survive trim().
	const { tagline: rawTagline, description: rawDescription } = siteConfig;
	const tagline = rawTagline && stegaClean(rawTagline).trim() ? rawTagline : defaultTagline;
	const description = rawDescription && stegaClean(rawDescription).trim() ? rawDescription : defaultSiteDescription;

	return (
		<div className="content">
			<HomeHero tagline={tagline} description={description} />

			{blocks.map((block) => (
				<Block key={block._key} content={block} priority={block._key === leadPreviewKey} />
			))}

			<BrowseByTag summaries={tagSummaries} />
		</div>
	);
}
