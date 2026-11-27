import serializeJsonLd from "@helpers/structured-data/serialize";
import type { JsonLd as JsonLdData } from "@helpers/structured-data/types";
import { stegaClean } from "next-sanity";
import "server-only";

type Props = Readonly<{
	data: JsonLdData | ReadonlyArray<JsonLdData>;
}>;

/**
 * Renders schema.org structured data as an inline JSON-LD script, the way the Next.js docs recommend.
 * Stega characters are stripped first, since in draft mode Sanity strings carry invisible markers.
 */
export default function JsonLd({ data }: Props) {
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inline; serializeJsonLd escapes "<".
			dangerouslySetInnerHTML={{ __html: serializeJsonLd(stegaClean(data)) }}
		/>
	);
}
