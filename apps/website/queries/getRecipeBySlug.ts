import type { Recipe } from "@ryan-bakes/sanity-types";
import throwError from "helpers/throwError";
import "server-only";
import type Query from "types/query";
import buildGroqQuery from "./lib/buildGroqQuery";
import nextFetch from "./lib/nextFetch";

export default async function getRecipeBySlug(slug: string): Promise<Recipe> {
	if (!slug || slug.length === 0) {
		throwError("Must provide an slug");
	}

	const url = buildGroqQuery(`*[ _type == 'recipe' && slug.current == '${slug}' ]`);

	const response = await nextFetch(url);
	const { status, statusText } = response;

	if (status !== 200) {
		throw new Error(`Got a ${status} response: ${statusText}`);
	}

	const { result } = (await response.json()) as Query<Recipe>;

	if (result.length === 0) {
		throwError(`Could not find recipe with slug: ${slug}`);
	}

	if (result.length > 1) {
		console.warn(`Got more than one recipe with slug ${slug}. Using the first.`, { slug, result });
	}

	if (result.length === 0) {
		throwError(`Could not find recipe with slug: ${slug}`);
	}

	return result[0];
}
