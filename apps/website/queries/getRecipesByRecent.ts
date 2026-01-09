import { throwTypedError } from "@helpers/throw-error";
import type { Recipe } from "@ryan-bakes/sanity-types";
import { sanityFetch } from "@shared/lib/live";
import { groq } from "@shared/lib/sanity";
import "server-only";

const recipesByRecentQuery = groq`*[_type == "recipe"] | order(_createdAt desc) [0...$count]{...}`;

export default async function getRecipesByRecent(count: number = 10): Promise<Recipe[]> {
	if (count < 0) {
		throwTypedError(RangeError, `count must be a non-negative integer, received: ${count}`);
	}

	const { data } = await sanityFetch({
		query: recipesByRecentQuery,
		params: { count },
		tags: ["recipe"],
	});

	return data as Recipe[];
}
