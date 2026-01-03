import Distinct from "@helpers/distinct";
import { fetchSanity, groq } from "@shared/lib/sanity";
import "server-only";

const allRecipeSlugsQuery = groq`*[_type == "recipe"]{ "slug": slug.current }`;

export default async function getAllRecipeSlugs(): Promise<string[]> {
	const result = await fetchSanity<{ slug?: string }[]>(
		allRecipeSlugsQuery,
		{},
		{ revalidate: 3_600, tags: ["recipe"] },
	);
	const slugs = result.map(({ slug }) => slug?.trim()).filter((slug): slug is string => Boolean(slug));

	return Distinct(slugs);
}
