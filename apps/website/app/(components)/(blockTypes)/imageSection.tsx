import createImageBuilder from 'hooks/useImageBuilder';
import Image from 'next/image';
import 'server-only';
import type { InlineImage } from 'types/sanity-schema';

export interface Props {
	value: InlineImage;
}

export default function ImageSection({ value: { asset, alt, emptyAlt, position } }: Props) {
	const imageBuilder = createImageBuilder(asset);

	const img2x = imageBuilder.buildUrlWithOptions({
		crop: 'focalpoint',
		quality: 55,
		width: 800,
		aspectRatio: 4 / 3,
		dpr: 2
	});
	const altText = (emptyAlt && alt ? '' : alt)!;

	//const float = position === 'Block' ? 'none' : position.toLowerCase();

	return <Image style={{ display: 'block', margin: '1rem 0', padding: 'o.5rem' }} src={img2x} alt={altText} width={400} height={(400 * 3) / 4} />;
}
