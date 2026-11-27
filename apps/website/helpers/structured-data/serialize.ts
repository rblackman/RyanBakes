import type { JsonLd } from "./types";

/**
 * Serializes JSON-LD for an inline `<script type="application/ld+json">`. Escaping `<` stops text from
 * the CMS (for example "</script>") from closing the script tag early, as the Next.js docs recommend.
 */
export default function serializeJsonLd(data: JsonLd | ReadonlyArray<JsonLd>): string {
	return JSON.stringify(data).replace(/</g, "\\u003c");
}
