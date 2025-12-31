"use client";
import clsx from "clsx";
import createImageBuilder from "hooks/useImageBuilder";
import NextImage, { type ImageLoaderProps } from "next/image";
import type { ImageWithAlt } from "types/sanity-schema";
import styles from "./(styles)/image.module.css";

interface OptionalBaseProps {
	quality: number;
	blur: number;
	crop: "top,left" | "top,right" | "bottom,left" | "bottom,right" | "center" | "focalpoint" | "entropy";
	fit: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
	className?: string;
	responsive?: boolean;
	priority?: boolean;
	alt?: string;
}

interface BaseProps extends Partial<OptionalBaseProps> {
	image: ImageWithAlt;
	width: number;
}

interface FixedWidthProps extends BaseProps {
	height: number;
}

interface AspectRatioProps extends BaseProps {
	aspectRatio: number;
}

type Props = FixedWidthProps | AspectRatioProps;

function isFixedWidth(props: Props): props is FixedWidthProps {
	const height = (props as FixedWidthProps)?.height;
	if (typeof height === "number") {
		return true;
	}
	return false;
}

export default function Image(props: Props) {
	const {
		image: { asset, alt, emptyAlt },
		width: baseWidth,
		quality: providedQuality,
		blur,
		crop,
		fit,
		className,
		responsive,
		priority,
		alt: altOverride,
	} = props;

	const { baseUrl, buildUrlWithOptions } = createImageBuilder(asset);

	// calculate height using either provided height or setting the aspect ratio
	const baseHeight = isFixedWidth(props) ? props.height : Math.round(baseWidth / props.aspectRatio);

	// regardless of if we provide an explicit height, we want to set an aspect ratio for CSS
	const aspectRatio = baseWidth / baseHeight;

	// loader function
	const loader = ({ width, quality }: ImageLoaderProps) => {
		const factor = width / baseWidth;

		return buildUrlWithOptions({
			width: Math.round(baseWidth * factor),
			height: Math.round(baseHeight * factor),
			quality: (providedQuality ?? quality ?? 75) / 100,

			...(blur !== undefined ? { blur } : {}),
			...(crop !== undefined ? { crop } : {}),
			...(fit !== undefined ? { fit } : {}),
		});
	};

	const width = 20;
	const height = 20 * aspectRatio;

	const blurImageUrl = buildUrlWithOptions({
		width,
		height,
		quality: 0.2,
		blur: 5,

		...(crop !== undefined ? { crop } : {}),
		...(fit !== undefined ? { fit } : {}),
	});

	// outer div is the container for our image
	// it gets an aspect ratio and width.
	// then the image is set to fill the container
	return (
		<div
			className={clsx(styles.image, className)}
			style={{ width: responsive ? "100%" : baseWidth, aspectRatio: aspectRatio }}
		>
			<NextImage
				src={baseUrl}
				loader={loader}
				fill
				priority={priority ?? false}
				alt={altOverride ?? (emptyAlt || !alt ? "" : alt)}
				sizes={`(max-width: ${baseWidth}px) 100vw, ${baseWidth}px`}
				placeholder="blur"
				blurDataURL={blurImageUrl}
			/>
		</div>
	);
}
