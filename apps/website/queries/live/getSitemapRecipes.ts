import type { SitemapRecipesQueryResult } from "@ryan-bakes/sanity-types";
import { sanityFetch } from "@shared/lib/live";
import { groq } from "@shared/lib/sanity";
import "server-only";

export type SitemapRecipe = Readonly<{
	slug: string;
	updatedAt: string;
	hidden: boolean;
	tags: ReadonlyArray<string>;
}>;

const sitemapRecipesQuery = groq`*[_type == "recipe" && defined(slug.current)] | order(slug.current asc){ "slug": slug.current, _updatedAt, disallowRobots, tags }`;

/**
 * Every published recipe with a slug, for the sitemap. Tagged "recipe", so publishing a recipe
 * refreshes the sitemap. Stega is off because slugs and tags become URLs.
 */
export default async function getSitemapRecipes(): Promise<SitemapRecipe[]> {
	const { data } = await sanityFetch({
		query: sitemapRecipesQuery,
		tags: ["recipe"],
		stega: false,
	});

	const recipes = data as SitemapRecipesQueryResult;

	return recipes.flatMap((recipe): SitemapRecipe[] => {
		const slug = recipe.slug?.trim();
		if (!slug) {
			return [];
		}

		const tags = (recipe.tags ?? []).map((tag) => tag.trim()).filter((tag) => tag.length > 0);

		return [{ slug, updatedAt: recipe._updatedAt, hidden: recipe.disallowRobots === true, tags }];
	});
}
