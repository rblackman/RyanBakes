import throwError from "@helpers/throw-error";
import type { Recipe } from "@ryan-bakes/sanity-types";
import { sanityFetch } from "@shared/lib/live";
import { groq } from "@shared/lib/sanity";
import "server-only";

const recipeByIdQuery = groq`*[_type == "recipe" && _id == $id][0]{...}`;

export default async function getRecipeById(id: string): Promise<Recipe> {
	if (!id) {
		throwError("Must provide an id");
	}

	const { data } = await sanityFetch({
		query: recipeByIdQuery,
		params: { id },
		tags: ["recipe", `recipe:${id}`],
	});

	const recipe = data as Recipe | null;

	if (!recipe) {
		throwError(`Could not find recipe with id: ${id}`);
	}

	return recipe;
}
