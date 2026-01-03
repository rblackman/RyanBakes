import throwError from "@helpers/throw-error";
import type { Recipe } from "@ryan-bakes/sanity-types";
import { fetchSanity, groq } from "@shared/lib/sanity";
import "server-only";

const recipesByTagQuery = groq`*[_type == "recipe" && $tag in tags[]]{...}`;

export default async function getRecipesByTag(tag: string): Promise<Recipe[]> {
	if (!tag) {
		throwError("Must provide a tag");
	}

	return fetchSanity<Recipe[]>(recipesByTagQuery, { tag }, { revalidate: 60, tags: ["recipe", `tag:${tag}`] });
}
