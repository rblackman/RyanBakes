import Distinct from "@helpers/distinct";
import { groq, sanityClient } from "@shared/lib/sanity";
import "server-only";

const allRecipeSlugsQuery = groq`*[_type == "recipe"]{ "slug": slug.current }`;

export default async function getAllRecipeSlugs(): Promise<string[]> {
	const data = await sanityClient.fetch(allRecipeSlugsQuery);

	const slugsData = data as Array<{ slug?: string }>;
	const slugs = slugsData
		.map(({ slug }): string | undefined => slug?.trim())
		.filter((slug): slug is string => Boolean(slug));

	return Distinct(slugs);
}
