import throwError from "@helpers/throw-error";
import type { Recipe } from "@ryan-bakes/sanity-types";
import { fetchSanity, groq } from "@shared/lib/sanity";
import "server-only";

const recipeBySlugQuery = groq`*[_type == "recipe" && slug.current == $slug][0]{...}`;

export default async function getRecipeBySlug(slug: string): Promise<Recipe> {
	if (!slug) {
		throwError("Must provide a slug");
	}

	const recipe = await fetchSanity<Recipe | null>(
		recipeBySlugQuery,
		{ slug },
		{ revalidate: 3_600, tags: ["recipe", `recipe:${slug}`] },
	);

	if (!recipe) {
		throwError(`Could not find recipe with slug: ${slug}`);
	}

	return recipe;
}
