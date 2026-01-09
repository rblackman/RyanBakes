import throwError from "@helpers/throw-error";
import type { RecipesPage } from "@ryan-bakes/sanity-types";
import { serverEnv } from "@shared/config/env.server";
import { sanityFetch } from "@shared/lib/live";
import { groq } from "@shared/lib/sanity";
import "server-only";

const recipesPageKey = serverEnv.RECIPES_PAGE_KEY;
const recipesPageQuery = groq`*[_type == "recipesPage" && _id == $recipesPageKey][0]{...}`;

export default async function getRecipesPage(): Promise<RecipesPage> {
	const { data } = await sanityFetch({
		query: recipesPageQuery,
		params: { recipesPageKey },
		tags: ["recipesPage", `page:${recipesPageKey}`],
	});

	const recipesPage = data as RecipesPage | null;

	if (!recipesPage) {
		throwError(`Could not find a ${recipesPageKey}.`);
	}

	return recipesPage;
}
