import Image from "@components/ui/image";
import throwError from "@helpers/throw-error";
import type { InlineImage } from "@ryan-bakes/sanity-types";
import "server-only";

export type Props = Readonly<{
	value: InlineImage;
}>;

export default function ImageSection({ value }: Props) {
	if (!value.asset) {
		return null;
	}

	if (!value.emptyAlt && !value.alt) {
		throwError("Image is missing alt text");
	}

	return <Image image={value} width={400} aspectRatio={4 / 3} style={{ margin: "1rem 0" }} />;
}
