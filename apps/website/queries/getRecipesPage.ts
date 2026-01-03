import throwError from "@helpers/throw-error";
import type { RecipesPage } from "@ryan-bakes/sanity-types";
import { serverEnv } from "@shared/config/env.server";
import { fetchSanity, groq } from "@shared/lib/sanity";
import "server-only";

const recipesPageKey = serverEnv.RECIPES_PAGE_KEY;
const recipesPageQuery = groq`*[_type == "recipesPage" && _id == $recipesPageKey][0]{...}`;

export default async function getRecipesPage(): Promise<RecipesPage> {
	const recipesPage = await fetchSanity<RecipesPage | null>(
		recipesPageQuery,
		{ recipesPageKey },
		{ revalidate: 3_600, tags: ["recipesPage", `page:${recipesPageKey}`] },
	);

	if (!recipesPage) {
		throwError(`Could not find a ${recipesPageKey}.`);
	}

	return recipesPage;
}
