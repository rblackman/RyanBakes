import throwError from "@helpers/throw-error";
import type { Page } from "@ryan-bakes/sanity-types";
import { sanityFetch } from "@shared/lib/live";
import { groq } from "@shared/lib/sanity";
import "server-only";

const pageByIdQuery = groq`*[_type == "page" && _id == $id][0]{...}`;

export default async function getPageById(id: string): Promise<Page> {
	if (!id) {
		throwError("Must provide an id");
	}

	const { data } = await sanityFetch({
		query: pageByIdQuery,
		params: { id },
		tags: ["page", `page:${id}`],
	});

	const page = data as Page | null;

	if (!page) {
		throwError(`Could not find page with id: ${id}`);
	}

	return page;
}
