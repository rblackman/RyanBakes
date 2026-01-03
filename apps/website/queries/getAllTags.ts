import type { Recipe } from "@ryan-bakes/sanity-types";
import Distinct from "helpers/distinct";
import "server-only";
import { fetchSanity, groq } from "../shared/lib/sanity";

const allTagsQuery = groq`*[_type == "recipe"]{ tags }`;

export default async function getAllTags(): Promise<string[]> {
	const recipes = await fetchSanity<Pick<Recipe, "tags">[]>(allTagsQuery, {}, { revalidate: 300, tags: ["recipe"] });
	const tags = recipes.flatMap((recipe) => recipe.tags ?? []);
	return Distinct(tags);
}
