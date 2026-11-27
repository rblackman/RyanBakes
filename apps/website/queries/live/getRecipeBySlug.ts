import throwError from "@helpers/throw-error";
import type { Recipe } from "@ryan-bakes/sanity-types";
import { sanityFetch } from "@shared/lib/live";
import { groq } from "@shared/lib/sanity";
import { notFound } from "next/navigation";
import "server-only";

const recipeBySlugQuery = groq`*[_type == "recipe" && slug.current == $slug][0]{...}`;

export default async function getRecipeBySlug(slug: string): Promise<Recipe> {
	if (!slug) {
		throwError("Must provide a slug");
	}

	const { data } = await sanityFetch({
		query: recipeBySlugQuery,
		params: { slug },
		tags: ["recipe", `recipe:${slug}`],
	});

	const recipe = data as Recipe | null;

	// An unknown slug is a 404, not a server error, so crawlers drop the URL.
	if (!recipe) {
		notFound();
	}

	return recipe;
}
