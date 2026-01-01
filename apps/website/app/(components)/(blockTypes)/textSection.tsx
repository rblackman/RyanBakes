import "server-only";
import type { TextSection } from "types/sanity-schema";
import PortableText from "../portableText";

export interface Props {
	value: TextSection;
}

export default function CustomTextSection({ value: { text } }: Props) {
	return <PortableText value={text} />;
}
