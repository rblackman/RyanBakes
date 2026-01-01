import "server-only";
import type Query from "types/query";
import buildGroqQuery from "./lib/buildGroqQuery";
import nextFetch from "./lib/nextFetch";

export default async function getAllRecipeSlugs(): Promise<string[]> {
	const url = buildGroqQuery(`*[ _type == 'recipe' ] { 'slug': slug.current }`);
	const response = await nextFetch(url);
	var { result } = (await response.json()) as Query<{ slug: string }>;
	return result.map(({ slug }) => slug);
}
