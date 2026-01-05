import { createClient, groq } from "next-sanity";
import "server-only";
import { clientEnv } from "../config/env.client";

const sanityClient = createClient({
	projectId: clientEnv.NEXT_PUBLIC_SANITY_KEY,
	dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: "2025-01-01",
	useCdn: true,
	perspective: "published",
	stega: {
		studioUrl: clientEnv.NEXT_PUBLIC_SANITY_STUDIO_URL,
	},
});

export { groq, sanityClient };
