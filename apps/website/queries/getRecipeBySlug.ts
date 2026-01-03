import type { Recipe } from "@ryan-bakes/sanity-types";
import { groq } from "../lib/sanity";
import "server-only";
import { fetchSanity } from "./lib/fetchSanity";

const recipeBySlugQuery = groq`*[_type == "recipe" && slug.current == $slug][0]{...}`;

export default async function getRecipeBySlug(slug: string): Promise<Recipe> {
	if (!slug || slug.length === 0) {
		throw new Error("Must provide a slug");
	}

	const recipe = await fetchSanity<Recipe | null>(
		recipeBySlugQuery,
		{ slug },
		{ revalidate: 60, tags: ["recipe", `recipe:${slug}`] },
	);

	if (!recipe) {
		throw new Error(`Could not find recipe with slug: ${slug}`);
	}

	return recipe;
}
