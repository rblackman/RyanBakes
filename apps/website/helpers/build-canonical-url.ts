import { clientEnv } from "@shared/config/env.client";

export default function buildCanonicalUrl(pathname: string, baseUrl?: string): string | undefined {
	if (!pathname) {
		return undefined;
	}

	const resolvedBaseUrl = baseUrl ?? clientEnv.NEXT_PUBLIC_BASE_URL;
	const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

	try {
		return new URL(normalizedPath, resolvedBaseUrl).toString();
	} catch {
		return undefined;
	}
}
