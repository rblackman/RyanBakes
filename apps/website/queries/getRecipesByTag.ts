import type { Recipe } from "@ryan-bakes/sanity-types";
import "server-only";
import type Query from "types/query";
import buildGroqQuery from "./lib/buildGroqQuery";
import nextFetch from "./lib/nextFetch";

export default async function getRecipesByTag(tag: string): Promise<Query<Recipe>> {
	const url = buildGroqQuery(`*[ _type == 'recipe' && '${tag}' in tags[]]`);
	const response = await nextFetch(url);
	return response.json();
}
