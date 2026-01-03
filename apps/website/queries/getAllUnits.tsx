import type { Unit } from "@ryan-bakes/sanity-types";
import { groq } from "../lib/sanity";
import "server-only";
import { fetchSanity } from "./lib/fetchSanity";

const allUnitsQuery = groq`*[_type == "unit"] | order(name asc){...}`;

export default async function getAllUnits(): Promise<Unit[]> {
	return fetchSanity<Unit[]>(allUnitsQuery, {}, { revalidate: 3600, tags: ["unit"] });
}
