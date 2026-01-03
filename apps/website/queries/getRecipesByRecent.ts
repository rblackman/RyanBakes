import { throwTypedError } from "@helpers/throw-error";
import type { Recipe } from "@ryan-bakes/sanity-types";
import { fetchSanity, groq } from "@shared/lib/sanity";
import "server-only";

const recipesByRecentQuery = groq`*[_type == "recipe"] | order(_createdAt desc) [0...$count]{...}`;

export default async function getRecipesByRecent(count: number = 10): Promise<Recipe[]> {
	if (count < 0) {
		throwTypedError(RangeError, `count must be a non-negative integer, received: ${count}`);
	}
	return fetchSanity<Recipe[]>(recipesByRecentQuery, { count }, { revalidate: 60, tags: ["recipe"] });
}
