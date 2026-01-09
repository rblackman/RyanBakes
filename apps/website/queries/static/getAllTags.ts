import Distinct from "@helpers/distinct";
import type { Recipe } from "@ryan-bakes/sanity-types";
import { groq, sanityClient } from "@shared/lib/sanity";
import "server-only";

const allTagsQuery = groq`*[_type == "recipe"]{ tags }`;

export default async function getAllTags(): Promise<string[]> {
	const data = await sanityClient.fetch(allTagsQuery);

	const recipes = data as Array<Pick<Recipe, "tags">>;
	const tags = recipes
		.flatMap((recipe) => recipe.tags ?? [])
		.map((tag) => tag?.trim())
		.filter((tag): tag is string => Boolean(tag));

	return Distinct(tags);
}
