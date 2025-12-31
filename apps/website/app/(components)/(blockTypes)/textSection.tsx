import 'server-only';
import type { TextSection } from 'types/sanity-schema';
import PortableText from '../portableText';

export interface Props {
	value: TextSection;
}

export default function TextSection({ value: { text } }: Props) {
	return <PortableText value={text} />;
}
