import type { Recipe } from "@ryan-bakes/sanity-types";
import { groq } from "../lib/sanity";
import "server-only";
import { fetchSanity } from "./lib/fetchSanity";

const recipesByTagQuery = groq`*[_type == "recipe" && $tag in tags[]]{...}`;

export default async function getRecipesByTag(tag: string): Promise<Recipe[]> {
	if (!tag || tag.length === 0) {
		throw new Error("Must provide a tag");
	}

	return fetchSanity<Recipe[]>(recipesByTagQuery, { tag }, { revalidate: 60, tags: ["recipe", `tag:${tag}`] });
}
