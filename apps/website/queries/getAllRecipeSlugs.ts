import { groq } from "../lib/sanity";
import "server-only";
import { fetchSanity } from "./lib/fetchSanity";

const allRecipeSlugsQuery = groq`*[_type == "recipe"]{ "slug": slug.current }`;

export default async function getAllRecipeSlugs(): Promise<string[]> {
	const result = await fetchSanity<{ slug?: string }[]>(allRecipeSlugsQuery, {}, { revalidate: 300, tags: ["recipe"] });
	return result.flatMap(({ slug }) => (slug ? [slug] : []));
}
