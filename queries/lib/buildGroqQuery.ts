import { clientEnv } from "shared/config/env.client";

const siteKey = clientEnv.NEXT_PUBLIC_SANITY_KEY;
const dataset = clientEnv.NEXT_PUBLIC_SANITY_DATASET;

const baseAddress = `https://${siteKey}.api.sanity.io/v2021-10-21/data/query/${dataset}`;

export default function buildGroqQuery(groq: string) {
	const encodedQuery = encodeURIComponent(groq);
	const url = `${baseAddress}?query=${encodedQuery}`;
	return url;
}
