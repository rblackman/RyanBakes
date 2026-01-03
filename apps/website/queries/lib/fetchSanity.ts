import "server-only";
import { sanityClient } from "../../lib/sanity";

export function fetchSanity<T>(
	query: string,
	params: Record<string, unknown> = {},
	{ revalidate = 60, tags = [] }: { revalidate?: number; tags?: string[] } = {},
) {
	return sanityClient.fetch<T>(query, params, { next: { revalidate, tags } });
}
