import type { Unit } from "@ryan-bakes/sanity-types";
import "server-only";
import { fetchSanity, groq } from "@shared/lib/sanity";

const allUnitsQuery = groq`*[_type == "unit"] | order(name asc){...}`;

export default async function getAllUnits(): Promise<Unit[]> {
	return fetchSanity<Unit[]>(allUnitsQuery, {}, { revalidate: 3600, tags: ["unit"] });
}
