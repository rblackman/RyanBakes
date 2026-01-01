import { clientEnv } from "shared/config/env.client";
import type { SanityImageAsset, SanityReference } from "types/sanity-schema";

const sanityKey = clientEnv.NEXT_PUBLIC_SANITY_KEY;
const dataset = clientEnv.NEXT_PUBLIC_SANITY_DATASET;

interface OptionalBaseOptions {
	quality: number;
	blur: number;
	crop: "top,left" | "top,right" | "bottom,left" | "bottom,right" | "center" | "focalpoint" | "entropy";
	dpr: number;
	fit: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
}

interface BaseOptions extends Partial<OptionalBaseOptions> {
	width: number;
}

interface FixedWidthOptions extends BaseOptions {
	height: number;
}

interface AspectRatioOptions extends BaseOptions {
	aspectRatio: number;
}

type Options = FixedWidthOptions | AspectRatioOptions;

function isFixedWidth(options: Options): options is FixedWidthOptions {
	const height = (options as FixedWidthOptions)?.height;
	if (typeof height === "number") {
		return true;
	}
	return false;
}

export interface ImageBuilder {
	baseUrl: string;
	buildUrlWithOptions: (options: Options) => string;
}

export default function createImageBuilder({ _ref: ref }: SanityReference<SanityImageAsset>): ImageBuilder {
	const baseUrl = (() => {
		if (ref) {
			const splits = ref.split("-");
			const imgName = `${splits[1]}-${splits[2]}.${splits[3]}`;
			return `https://cdn.sanity.io/images/${sanityKey}/${dataset}/${imgName}`;
		}
		return "";
	})();

	const buildUrlWithOptions = (options: Options) => {
		const { quality, blur, crop, dpr, fit, width } = options;
		const height = isFixedWidth(options) ? options.height : Math.round(width / options.aspectRatio);

		const params = new URLSearchParams({
			quality: (quality ?? 75).toString(),
			crop: crop ?? "entropy",
			dpr: (dpr ?? 1).toString(),
			fit: fit ?? "crop",
			w: width.toString(),
			h: height.toString(),
			format: "webp",
		});

		if (blur) {
			params.append("blur", blur.toString());
		}

		return `${baseUrl}?${params.toString()}`;
	};

	return {
		baseUrl,
		buildUrlWithOptions,
	};
}
