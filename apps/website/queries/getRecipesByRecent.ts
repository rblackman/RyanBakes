import type { Recipe } from "@ryan-bakes/sanity-types";
import { groq } from "../lib/sanity";
import "server-only";
import { fetchSanity } from "./lib/fetchSanity";

const recipesByRecentQuery = groq`*[_type == "recipe"] | order(_createdAt desc) [0...$count]{...}`;

export default async function getRecipesByRecent(count: number = 10): Promise<Recipe[]> {
	const normalizedCount = Math.max(count, 0);
	return fetchSanity<Recipe[]>(recipesByRecentQuery, { count: normalizedCount }, { revalidate: 60, tags: ["recipe"] });
}
