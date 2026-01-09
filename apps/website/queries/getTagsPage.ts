import throwError from "@helpers/throw-error";
import type { TagsPage } from "@ryan-bakes/sanity-types";
import { serverEnv } from "@shared/config/env.server";
import { sanityFetch } from "@shared/lib/live";
import { groq } from "@shared/lib/sanity";
import "server-only";

const tagsPageKey = serverEnv.TAGS_PAGE_KEY;
const tagsPageQuery = groq`*[_type == "tagsPage" && _id == $tagsPageKey][0]{...}`;

export default async function getTagsPage(): Promise<TagsPage> {
	const { data } = await sanityFetch({
		query: tagsPageQuery,
		params: { tagsPageKey },
		tags: ["tagsPage", `page:${tagsPageKey}`],
	});

	const tagsPage = data as TagsPage | null;

	if (!tagsPage) {
		throwError(`Could not find a ${tagsPageKey}.`);
	}

	return tagsPage;
}
