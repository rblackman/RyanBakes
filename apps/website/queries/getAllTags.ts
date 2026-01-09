import Distinct from "@helpers/distinct";
import type { Recipe } from "@ryan-bakes/sanity-types";
import { sanityFetch } from "@shared/lib/live";
import { groq, sanityClient } from "@shared/lib/sanity";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import "server-only";

const allTagsQuery = groq`*[_type == "recipe"]{ tags }`;

export default async function getAllTags(): Promise<string[]> {
	// During the production build, Next.js static param collection runs outside a request
	// scope, so avoid live preview APIs that call draftMode.
	const data =
		process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD
			? await sanityClient.fetch(allTagsQuery)
			: (
					await sanityFetch({
						query: allTagsQuery,
						tags: ["recipe"],
					})
				).data;

	const recipes = data as Array<Pick<Recipe, "tags">>;
	const tags = recipes
		.flatMap((recipe) => recipe.tags ?? [])
		.map((tag) => tag?.trim())
		.filter((tag): tag is string => Boolean(tag));

	return Distinct(tags);
}
