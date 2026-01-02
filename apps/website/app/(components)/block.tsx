import type { InlineImage, RecipePreview, TextSection } from "@ryan-bakes/sanity-types";
import assertUnreachable from "helpers/assertUnreachable";
import "server-only";
import ImageSectionComponent from "./(blockTypes)/imageSection";
import TextSectionComponent from "./(blockTypes)/textSection";

type Keyed<T> = T & { _key: string };

interface Props {
	content: Keyed<InlineImage> | Keyed<TextSection> | Keyed<RecipePreview>;
}

export default function Block({ content }: Props) {
	switch (content._type) {
		case "inlineImage": {
			return <ImageSectionComponent value={content} />;
		}
		case "textSection": {
			return <TextSectionComponent value={content} />;
		}
		case "recipePreview": {
			return <p>RECIPE PREVIEW</p>;
		}
		default: {
			return assertUnreachable(content);
		}
	}
}
