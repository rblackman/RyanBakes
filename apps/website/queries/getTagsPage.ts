import throwError from "@helpers/throw-error";
import type { TagsPage } from "@ryan-bakes/sanity-types";
import { serverEnv } from "@shared/config/env.server";
import { fetchSanity, groq } from "@shared/lib/sanity";
import "server-only";

const tagsPageKey = serverEnv.TAGS_PAGE_KEY;
const tagsPageQuery = groq`*[_type == "tagsPage" && _id == $tagsPageKey][0]{...}`;

export default async function getTagsPage(): Promise<TagsPage> {
	const tagsPage = await fetchSanity<TagsPage | null>(
		tagsPageQuery,
		{ tagsPageKey },
		{ revalidate: 300, tags: ["tagsPage", `page:${tagsPageKey}`] },
	);

	if (!tagsPage) {
		throwError(`Could not find a ${tagsPageKey}.`);
	}

	return tagsPage;
}
