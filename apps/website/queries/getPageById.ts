import type { Page } from "@ryan-bakes/sanity-types";
import { groq } from "../lib/sanity";
import "server-only";
import { fetchSanity } from "./lib/fetchSanity";

const pageByIdQuery = groq`*[_type == "page" && _id == $id][0]{...}`;

export default async function getPageById(id: string): Promise<Page> {
	if (!id || id.length === 0) {
		throw new Error("Must provide an id");
	}

	const page = await fetchSanity<Page | null>(pageByIdQuery, { id }, { revalidate: 300, tags: ["page", `page:${id}`] });

	if (!page) {
		throw new Error(`Could not find page with id: ${id}`);
	}

	return page;
}
