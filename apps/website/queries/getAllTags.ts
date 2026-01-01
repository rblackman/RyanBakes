import type { Recipe } from "@ryan-bakes/sanity-types";
import Distinct from "helpers/distinct";
import "server-only";
import type Query from "types/query";
import buildGroqQuery from "./lib/buildGroqQuery";
import nextFetch from "./lib/nextFetch";

export default async function getAllTags(): Promise<string[]> {
	const url = buildGroqQuery(`*[_type == "recipe"]{ tags }`);
	const response = await nextFetch(url);
	const { result } = (await response.json()) as Query<Pick<Recipe, "tags">>;

	const tags = result.flatMap((r) => r.tags ?? []);
	return Distinct(tags);
}
