import type { RichTextHeadingLevel } from "@components/ui/portable-text";
import assertUnreachable from "@helpers/assert-unreachable";
import type { InlineImage, RecipePreview, TextSection } from "@ryan-bakes/sanity-types";
import type Keyed from "@t/keyed";
import "server-only";
import ImageSectionComponent from "./block-types/image-section";
import RecipePreviewComponent from "./block-types/recipe-preview";
import TextSectionComponent from "./block-types/text-section";

type Props = Readonly<{
	content: Keyed<InlineImage> | Keyed<TextSection> | Keyed<RecipePreview>;
	/** The highest level a heading inside a text section may use. Pass a deeper level when nested. */
	minHeadingLevel?: RichTextHeadingLevel | undefined;
	/** Fetch this block's picture early. Only for a block likely to hold the page's largest element. */
	priority?: boolean | undefined;
}>;

export default function Block({ content, minHeadingLevel, priority = false }: Props) {
	switch (content._type) {
		case "inlineImage": {
			return <ImageSectionComponent value={content} />;
		}
		case "textSection": {
			return <TextSectionComponent value={content} minHeadingLevel={minHeadingLevel} />;
		}
		case "recipePreview": {
			return <RecipePreviewComponent value={content} priority={priority} />;
		}
		default: {
			return assertUnreachable(content);
		}
	}
}
