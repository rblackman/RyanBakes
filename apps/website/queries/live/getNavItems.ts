import { sanityFetch } from "@shared/lib/live";
import { groq } from "@shared/lib/sanity";
import "server-only";

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
	const { data } = await sanityFetch({
		query: navItemsQuery,
		tags: ["navItem"],
	});

	return data as NavItemQueryResult[];
}
