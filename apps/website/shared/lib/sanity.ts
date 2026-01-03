import { createClient, groq } from "next-sanity";
import "server-only";
import { clientEnv } from "../config/env.client";

const sanityClient = createClient({
	projectId: clientEnv.NEXT_PUBLIC_SANITY_KEY,
	dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: "2025-01-01",
	useCdn: true,
	perspective: "published",
	stega: false,
});

function fetchSanity<T>(
	query: string,
	params: Record<string, unknown> = {},
	{ revalidate = 60, tags = [] }: { revalidate?: number; tags?: string[] } = {},
) {
	return sanityClient.fetch<T>(query, params, { next: { revalidate, tags } });
}

export { fetchSanity, groq, sanityClient };
