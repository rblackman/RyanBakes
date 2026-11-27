import PortableText, { type RichTextHeadingLevel } from "@components/ui/portable-text";
import type { TextSection } from "@ryan-bakes/sanity-types";
import "server-only";

export type Props = Readonly<{
	value: TextSection;
	minHeadingLevel?: RichTextHeadingLevel | undefined;
}>;

export default function CustomTextSection({ value: { text }, minHeadingLevel }: Props) {
	if (!text || text.length === 0) {
		return null;
	}
	return <PortableText value={text} minHeadingLevel={minHeadingLevel} />;
}
