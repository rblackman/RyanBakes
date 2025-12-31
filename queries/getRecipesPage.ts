import "server-only";
import { serverEnv } from "shared/config/env.server";
import type Query from "types/query";
import type { RecipesPage } from "types/sanity-schema";
import buildGroqQuery from "./lib/buildGroqQuery";
import nextFetch from "./lib/nextFetch";

const recipesPageKey = serverEnv.RECIPES_PAGE_KEY;

export default async function getRecipesPage(): Promise<RecipesPage> {
	const url = buildGroqQuery(`*[ _id == '${recipesPageKey}' ]`);
	const response = await nextFetch(url);
	const { result } = (await response.json()) as Query<RecipesPage>;

	if (result.length === 0) {
		throw new Error(`Could not find a ${recipesPageKey}.`);
	}

	if (result.length > 1) {
		console.warn(`Got more than one ${recipesPageKey}. Using the first.`, {
			result,
		});
	}

	return result[0];
}
