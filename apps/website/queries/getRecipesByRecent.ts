import type { Recipe } from "@ryan-bakes/sanity-types";
import "server-only";
import type Query from "types/query";
import buildGroqQuery from "./lib/buildGroqQuery";
import nextFetch from "./lib/nextFetch";

export default async function getRecipesByRecent(count: number = 10): Promise<Query<Recipe>> {
	const url = buildGroqQuery(`*[ _type == 'recipe' ] | order(_createdAt desc) [0...${count}]`);
	const response = await nextFetch(url);
	return response.json();
}
