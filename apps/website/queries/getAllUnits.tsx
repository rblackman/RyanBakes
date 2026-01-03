import type { Unit } from "@ryan-bakes/sanity-types";
import { fetchSanity, groq } from "@shared/lib/sanity";
import "server-only";

const allUnitsQuery = groq`*[_type == "unit"] | order(name asc){...}`;

export default async function getAllUnits(): Promise<Unit[]> {
	return fetchSanity<Unit[]>(allUnitsQuery, {}, { revalidate: 7_200, tags: ["unit"] });
}
