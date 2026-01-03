import throwError from "@helpers/throwError";
import createImageBuilder from "@hooks/useImageBuilder";
import type { InlineImage } from "@ryan-bakes/sanity-types";
import Image from "next/image";
import "server-only";

export interface Props {
	value: InlineImage;
}

export default function ImageSection({ value: { asset, alt, emptyAlt } }: Props) {
	if (!asset) {
		return null;
	}

	const imageBuilder = createImageBuilder(asset);

	const img2x = imageBuilder.buildUrlWithOptions({
		crop: "focalpoint",
		quality: 55,
		width: 800,
		aspectRatio: 4 / 3,
		dpr: 2,
	});

	const altText = (() => {
		if (emptyAlt) {
			return "";
		}
		if (alt) {
			return alt;
		}
		throwError("Image is missing alt text");
	})();

	//const float = position === 'Block' ? 'none' : position.toLowerCase();

	return (
		<Image
			style={{ display: "block", margin: "1rem 0", padding: "0.5rem" }}
			src={img2x}
			alt={altText}
			width={400}
			height={(400 * 3) / 4}
		/>
	);
}
