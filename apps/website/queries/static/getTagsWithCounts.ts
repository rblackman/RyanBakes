import type { Recipe } from "@ryan-bakes/sanity-types";
import { groq, sanityClient } from "@shared/lib/sanity";
import "server-only";

export type TagWithCount = {
	tag: string;
	count: number;
};

const allTagsWithCountsQuery = groq`*[_type == "recipe"]{ tags }`;

export default async function getTagsWithCounts(): Promise<TagWithCount[]> {
	const data = await sanityClient.fetch(allTagsWithCountsQuery);
	const recipes = data as Array<Pick<Recipe, "tags">>;

	const counts = new Map<string, number>();
	for (const recipe of recipes) {
		for (const raw of recipe.tags ?? []) {
			const tag = raw?.trim();
			if (tag) {
				counts.set(tag, (counts.get(tag) ?? 0) + 1);
			}
		}
	}

	return [...counts.entries()].map(([tag, count]) => ({ tag, count })).sort((a, b) => a.tag.localeCompare(b.tag));
}
