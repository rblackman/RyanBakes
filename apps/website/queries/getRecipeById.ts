import throwError from "@helpers/throw-error";
import type { Recipe } from "@ryan-bakes/sanity-types";
import { fetchSanity, groq } from "@shared/lib/sanity";
import "server-only";

const recipeByIdQuery = groq`*[_type == "recipe" && _id == $id][0]{...}`;

export default async function getRecipeById(id: string): Promise<Recipe> {
	if (!id) {
		throwError("Must provide an id");
	}

	const recipe = await fetchSanity<Recipe | null>(
		recipeByIdQuery,
		{ id },
		{ revalidate: 60, tags: ["recipe", `recipe:${id}`] },
	);

	if (!recipe) {
		throwError(`Could not find recipe with id: ${id}`);
	}

	return recipe;
}
