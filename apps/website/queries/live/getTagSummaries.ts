import type { TagSummariesQueryResult } from "@ryan-bakes/sanity-types";
import { sanityFetch } from "@shared/lib/live";
import { groq } from "@shared/lib/sanity";
import "server-only";

export type TagRecipe = Readonly<{
	title: string;
	slug: string;
}>;

export type TagSummary = Readonly<{
	tag: string;
	count: number;
	recipes: ReadonlyArray<TagRecipe>;
}>;

const tagSummariesQuery = groq`*[_type == "recipe" && defined(tags)] | order(title asc){ title, "slug": slug.current, tags }`;

/**
 * Every distinct recipe tag with its recipe count and recipes (sorted by title), sorted by tag.
 * Tagged "recipe", so publishing any recipe refreshes it. Stega is off because the tag strings
 * are used as map keys and URLs.
 */
export default async function getTagSummaries(): Promise<TagSummary[]> {
	const { data } = await sanityFetch({
		query: tagSummariesQuery,
		tags: ["recipe"],
		stega: false,
	});

	const recipes: TagSummariesQueryResult = data;
	const counts = new Map<string, number>();
	const byTag = new Map<string, TagRecipe[]>();

	for (const recipe of recipes) {
		const title = recipe.title?.trim();
		const slug = recipe.slug?.trim();

		for (const raw of new Set(recipe.tags ?? [])) {
			const tag = raw.trim();
			if (!tag) {
				continue;
			}

			counts.set(tag, (counts.get(tag) ?? 0) + 1);

			// Only recipes with a title and slug can be linked; they still count above.
			const list = byTag.get(tag) ?? [];
			if (title && slug) {
				list.push({ title, slug });
			}
			byTag.set(tag, list);
		}
	}

	return [...counts.entries()]
		.map(([tag, count]) => ({ tag, count, recipes: byTag.get(tag) ?? [] }))
		.sort((a, b) => a.tag.localeCompare(b.tag));
}
