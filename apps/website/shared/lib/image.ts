import { createImageUrlBuilder, type SanityImageLike } from "@sanity/image-url";
import { clientEnv } from "../config/env.client";

export const sanityImageProject = {
	projectId: clientEnv.NEXT_PUBLIC_SANITY_KEY,
	dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
} as const;

const builder = createImageUrlBuilder(sanityImageProject);

/**
 * A URL builder for a Sanity image that applies the crop and hotspot set in the Studio.
 * Callers check that `image.asset` exists first.
 */
export function urlForImage(image: SanityImageLike) {
	return builder.image(image);
}

/**
 * A fixed-size JPEG for Open Graph and Twitter cards. Crawlers handle JPEG best, so the format is
 * pinned instead of negotiated with `auto=format`.
 */
export function socialImageUrl(image: SanityImageLike, width: number, height: number): string {
	return urlForImage(image).width(width).height(height).fit("crop").format("jpg").quality(80).url();
}
