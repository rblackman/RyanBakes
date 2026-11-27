import type { ImageWithAlt, InlineImage } from "@ryan-bakes/sanity-types";
import { sanityImageProject } from "@shared/lib/image";
import clsx from "clsx";
import { Image as SanityImage } from "next-sanity/image";
import type { CSSProperties } from "react";
import styles from "./image.module.css";

type Props = Readonly<{
	image: ImageWithAlt | InlineImage;
	/** Display width in CSS pixels. The image never renders wider than this unless `responsive` is set. */
	width: number;
	/** Width divided by height. The Sanity CDN crops to it around the hotspot. */
	aspectRatio: number;
	/** Overrides the `sizes` attribute. Defaults to `width`, or the full viewport on narrow screens. */
	sizes?: string | undefined;
	className?: string | undefined;
	style?: CSSProperties | undefined;
	/** Stretch to the container's width instead of `width`. */
	responsive?: boolean | undefined;
	/** Preload and fetch with high priority. Only for the image that is likely the LCP element. */
	preload?: boolean | undefined;
	/** Overrides the alt text stored with the image. */
	alt?: string | undefined;
}>;

/**
 * Renders a Sanity image through the Sanity image CDN (next-sanity's loader): a responsive `srcset`,
 * AVIF or WebP where the browser supports it, and the Studio's crop and hotspot applied.
 * A server component; only next/image's own client code ships.
 */
export default function Image({
	image,
	width,
	aspectRatio,
	sizes,
	className,
	style,
	responsive = false,
	preload = false,
	alt: altOverride,
}: Props) {
	if (!image.asset) {
		return null;
	}

	const height = Math.round(width / aspectRatio);
	const alt = altOverride ?? (image.emptyAlt || !image.alt ? "" : image.alt);

	return (
		<div
			className={clsx(styles.image, className)}
			style={{ ...style, width: responsive ? "100%" : width, aspectRatio }}
		>
			<SanityImage
				src={image}
				{...sanityImageProject}
				width={width}
				height={height}
				sizes={sizes ?? `(max-width: ${width}px) 100vw, ${width}px`}
				alt={alt}
				{...(preload ? { preload: true, fetchPriority: "high" as const } : {})}
			/>
		</div>
	);
}
