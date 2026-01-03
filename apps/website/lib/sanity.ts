import { createClient, groq } from "next-sanity";
import { ProxyAgent, setGlobalDispatcher } from "undici";
import "server-only";
import { clientEnv } from "../shared/config/env.client";

const proxyUrl = process.env.HTTPS_PROXY ?? process.env.https_proxy ?? process.env.HTTP_PROXY ?? process.env.http_proxy;

if (proxyUrl) {
	setGlobalDispatcher(new ProxyAgent(proxyUrl));
}

export const sanityClient = createClient({
	projectId: clientEnv.NEXT_PUBLIC_SANITY_KEY,
	dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: "2025-01-01",
	useCdn: true,
	perspective: "published",
	stega: false,
});

export { groq };
