import type { RecipesPage } from "@ryan-bakes/sanity-types";
import { groq } from "../lib/sanity";
import "server-only";
import { serverEnv } from "shared/config/env.server";
import { fetchSanity } from "./lib/fetchSanity";

const recipesPageKey = serverEnv.RECIPES_PAGE_KEY;
const recipesPageQuery = groq`*[_type == "recipesPage" && _id == $recipesPageKey][0]{...}`;

export default async function getRecipesPage(): Promise<RecipesPage> {
	const recipesPage = await fetchSanity<RecipesPage | null>(
		recipesPageQuery,
		{ recipesPageKey },
		{ revalidate: 300, tags: ["recipesPage", `page:${recipesPageKey}`] },
	);

	if (!recipesPage) {
		throw new Error(`Could not find a ${recipesPageKey}.`);
	}

	return recipesPage;
}
