import Distinct from "@helpers/distinct";
import { sanityFetch } from "@shared/lib/live";
import { groq, sanityClient } from "@shared/lib/sanity";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import "server-only";

const allRecipeSlugsQuery = groq`*[_type == "recipe"]{ "slug": slug.current }`;

export default async function getAllRecipeSlugs(): Promise<string[]> {
	// During the production build, Next.js static param collection runs outside a request
	// scope, so avoid live preview APIs that call draftMode.
	const data =
		process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD
			? await sanityClient.fetch(allRecipeSlugsQuery)
			: (
					await sanityFetch({
						query: allRecipeSlugsQuery,
						tags: ["recipe"],
					})
				).data;

	const slugsData = data as Array<{ slug?: string }>;
	const slugs = slugsData
		.map(({ slug }): string | undefined => slug?.trim())
		.filter((slug): slug is string => Boolean(slug));

	return Distinct(slugs);
}
