import type { Unit } from "@ryan-bakes/sanity-types";
import { sanityFetch } from "@shared/lib/live";
import { groq } from "@shared/lib/sanity";
import "server-only";

const allUnitsQuery = groq`*[_type == "unit"] | order(name asc){...}`;

export default async function getAllUnits(): Promise<Unit[]> {
	const { data } = await sanityFetch({
		query: allUnitsQuery,
		tags: ["unit"],
	});

	return data as Unit[];
}
