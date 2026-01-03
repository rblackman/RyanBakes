import "server-only";
import { fetchSanity, groq } from "@shared/lib/sanity";

export interface NavItemQueryResult {
	id: string;
	name: string;
	pageInfo: {
		type: "recipesPage" | "tagsPage" | "page";
		slug: { current: string } | null;
	};
}

const navItemsQuery = groq`*[_type == "navItem"]{ "id": _id, name, "pageInfo": page->{ "type": _type, slug } }`;

export default async function getNavItems(): Promise<NavItemQueryResult[]> {
	return fetchSanity<NavItemQueryResult[]>(navItemsQuery, {}, { revalidate: 300, tags: ["navItem"] });
}
