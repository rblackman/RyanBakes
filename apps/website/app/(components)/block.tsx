import assertUnreachable from 'helpers/assertUnreachable';
import 'server-only';
import type { InlineImage, RecipePreview, SanityKeyed, TextSection } from 'types/sanity-schema';
import ImageSectionComponent from './(blockTypes)/imageSection';
import TextSectionComponent from './(blockTypes)/textSection';

interface Props {
	content: SanityKeyed<InlineImage> | SanityKeyed<TextSection> | SanityKeyed<RecipePreview>;
}

export default function Block({ content }: Props) {
	const { _type: type } = content;
	switch (type) {
		case 'inlineImage':
			return <ImageSectionComponent value={content as InlineImage} />;
		case 'textSection':
			return <TextSectionComponent value={content as TextSection} />;
		case 'recipePreview':
			return <p>RECIPE PREVIEW</p>;
		default:
			assertUnreachable(type);
	}
	return null;
}
