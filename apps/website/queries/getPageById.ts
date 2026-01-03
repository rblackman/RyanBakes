import throwError from "@helpers/throwError";
import type { Page } from "@ryan-bakes/sanity-types";
import "server-only";
import { fetchSanity, groq } from "@shared/lib/sanity";

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
