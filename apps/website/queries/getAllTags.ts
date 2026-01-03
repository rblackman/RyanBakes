import Distinct from "@helpers/distinct";
import type { Recipe } from "@ryan-bakes/sanity-types";
import { fetchSanity, groq } from "@shared/lib/sanity";
import "server-only";

const allTagsQuery = groq`*[_type == "recipe"]{ tags }`;

export default async function getAllTags(): Promise<string[]> {
	const recipes = await fetchSanity<Pick<Recipe, "tags">[]>(allTagsQuery, {}, { revalidate: 3_600, tags: ["recipe"] });
	const tags = recipes
		.flatMap((recipe) => recipe.tags ?? [])
		.map((tag) => tag?.trim())
		.filter((tag): tag is string => Boolean(tag));

	return Distinct(tags);
}
