import assertUnreachable from "@helpers/assert-unreachable";
import type { InlineImage, RecipePreview, TextSection } from "@ryan-bakes/sanity-types";
import type Keyed from "@t/keyed";
import "server-only";
import ImageSectionComponent from "./block-types/image-section";
import RecipePreviewComponent from "./block-types/recipe-preview";
import TextSectionComponent from "./block-types/text-section";

type Props = Readonly<{
	content: Keyed<InlineImage> | Keyed<TextSection> | Keyed<RecipePreview>;
}>;

export default function Block({ content }: Props) {
	switch (content._type) {
		case "inlineImage": {
			return <ImageSectionComponent value={content} />;
		}
		case "textSection": {
			return <TextSectionComponent value={content} />;
		}
		case "recipePreview": {
			return <RecipePreviewComponent value={content} />;
		}
		default: {
			return assertUnreachable(content);
		}
	}
}
