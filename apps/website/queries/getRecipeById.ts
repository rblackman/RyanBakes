import type { Recipe } from "@ryan-bakes/sanity-types";
import "server-only";
import { fetchSanity, groq } from "../shared/lib/sanity";

const recipeByIdQuery = groq`*[_type == "recipe" && _id == $id][0]{...}`;

export default async function getRecipeById(id: string): Promise<Recipe> {
	if (!id || id.length === 0) {
		throw new Error("Must provide an id");
	}

	const recipe = await fetchSanity<Recipe | null>(
		recipeByIdQuery,
		{ id },
		{ revalidate: 60, tags: ["recipe", `recipe:${id}`] },
	);

	if (!recipe) {
		throw new Error(`Could not find recipe with id: ${id}`);
	}

	return recipe;
}
