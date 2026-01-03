import Distinct from "@helpers/distinct";
import "server-only";
import { fetchSanity, groq } from "@shared/lib/sanity";

const allRecipeSlugsQuery = groq`*[_type == "recipe"]{ "slug": slug.current }`;

export default async function getAllRecipeSlugs(): Promise<string[]> {
	const result = await fetchSanity<{ slug?: string }[]>(allRecipeSlugsQuery, {}, { revalidate: 300, tags: ["recipe"] });
	const slugs = result.map(({ slug }) => slug?.trim()).filter((slug): slug is string => Boolean(slug));

	return Distinct(slugs);
}
