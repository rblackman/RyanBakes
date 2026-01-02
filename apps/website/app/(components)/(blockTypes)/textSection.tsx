import type { TextSection } from "@ryan-bakes/sanity-types";
import "server-only";
import PortableText from "../portableText";

export interface Props {
	value: TextSection;
}

export default function CustomTextSection({ value: { text } }: Props) {
	if (!text || text.length === 0) {
		return null;
	}
	return <PortableText value={text} />;
}
