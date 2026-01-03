import Block from "@components/features/content-blocks/block";
import buildCanonicalUrl from "@helpers/build-canonical-url";
import getHomepage from "@queries/getHomepage";
import type { InlineImage, RecipePreview, TextSection } from "@ryan-bakes/sanity-types";
import type Keyed from "@t/keyed";
import type { Metadata } from "next";
import "server-only";

const homeCanonical = buildCanonicalUrl("/");
const homeTitle = "Home";
const homeDescription = "Browse Ryan Bakes recipes and baking tips.";

export const metadata: Metadata = {
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

export default async function Page() {
	const { content } = await getHomepage();
	const blocks: Array<Keyed<InlineImage | TextSection | RecipePreview>> = content ?? [];

	return (
		<main>
			<div className="content">
				{blocks.map((block) => (
					<Block key={block._key} content={block} />
				))}
			</div>
		</main>
	);
}
