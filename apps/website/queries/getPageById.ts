import throwError from "@helpers/throw-error";
import type { Page } from "@ryan-bakes/sanity-types";
import { fetchSanity, groq } from "@shared/lib/sanity";
import "server-only";

const pageByIdQuery = groq`*[_type == "page" && _id == $id][0]{...}`;

export default async function getPageById(id: string): Promise<Page> {
	if (!id) {
		throwError("Must provide an id");
	}

	const page = await fetchSanity<Page | null>(pageByIdQuery, { id }, { revalidate: 300, tags: ["page", `page:${id}`] });

	if (!page) {
		throwError(`Could not find page with id: ${id}`);
	}

	return page;
}
