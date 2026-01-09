import throwError from "@helpers/throw-error";
import type { Recipe } from "@ryan-bakes/sanity-types";
import { sanityFetch } from "@shared/lib/live";
import { groq } from "@shared/lib/sanity";
import type { QueryParams } from "next-sanity";
import "server-only";

const recipesByTagQuery = groq`*[_type == "recipe" && $recipeTag in tags[]]{...}`;

export default async function getRecipesByTag(tag: string): Promise<Recipe[]> {
	if (!tag) {
		throwError("Must provide a tag");
	}

	const cacheTags: string[] = ["recipe", `tag:${tag}`];
	const params: QueryParams = { recipeTag: tag };

	const options = {
		query: recipesByTagQuery,
		params,
		tags: cacheTags,
	} as Parameters<typeof sanityFetch>[0];

	const { data } = await sanityFetch(options);

	return data as Recipe[];
}
