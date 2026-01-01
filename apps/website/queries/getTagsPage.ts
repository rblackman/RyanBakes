import type { TagsPage } from "@ryan-bakes/sanity-types";
import "server-only";
import { serverEnv } from "shared/config/env.server";
import type Query from "types/query";
import buildGroqQuery from "./lib/buildGroqQuery";
import nextFetch from "./lib/nextFetch";

const tagsPageKey = serverEnv.TAGS_PAGE_KEY;

export default async function getTagsPage(): Promise<TagsPage> {
	const url = buildGroqQuery(`*[ _id == '${tagsPageKey}' ]`);
	const response = await nextFetch(url);
	const { result } = (await response.json()) as Query<TagsPage>;

	if (result.length === 0) {
		throw new Error(`Could not find a ${tagsPageKey}.`);
	}

	if (result.length > 1) {
		console.warn(`Got more than one ${tagsPageKey}. Using the first.`, {
			result,
		});
	}

	return result[0];
}
