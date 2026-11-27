import tagHref from "@helpers/tag-href";
import getSitemapRecipes from "@queries/live/getSitemapRecipes";
import getSiteInfo from "@shared/lib/site-info";
import type { MetadataRoute } from "next";
import "server-only";

/**
 * /sitemap.xml: the home page, the recipe and tag indexes, every recipe that isn't hidden from search
 * engines, and every tag page. lastModified is the newest update among the recipes a page lists.
 * Regenerated when a recipe is published (the query is tagged "recipe").
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [recipes, { baseUrl }] = await Promise.all([getSitemapRecipes(), getSiteInfo()]);
	const absolute = (path: string) => new URL(path, baseUrl).toString();
	const newest = (dates: ReadonlyArray<string>) =>
		dates.reduce<string | undefined>((a, b) => (!a || b > a ? b : a), undefined);

	const listed = recipes.filter((recipe) => !recipe.hidden);
	const latest = newest(listed.map((recipe) => recipe.updatedAt));

	const tagDates = new Map<string, string[]>();
	for (const recipe of recipes) {
		for (const tag of new Set(recipe.tags)) {
			tagDates.set(tag, [...(tagDates.get(tag) ?? []), recipe.updatedAt]);
		}
	}

	const withDate = (url: string, date: string | undefined): MetadataRoute.Sitemap[number] =>
		date ? { url, lastModified: date } : { url };

	return [
		withDate(absolute("/"), latest),
		withDate(absolute("/recipe"), latest),
		withDate(absolute("/tags"), latest),
		...listed.map((recipe) => withDate(absolute(`/recipe/${encodeURIComponent(recipe.slug)}`), recipe.updatedAt)),
		...[...tagDates.entries()]
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([tag, dates]) => withDate(absolute(tagHref(tag)), newest(dates))),
	];
}
