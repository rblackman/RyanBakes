import Block from "@components/features/content-blocks/block";
import getHomepage from "@queries/getHomepage";
import type { InlineImage, RecipePreview, TextSection } from "@ryan-bakes/sanity-types";
import type Keyed from "@t/keyed";
import "server-only";

export default async function Page() {
	const { content } = await getHomepage();
	const blocks: Array<Keyed<InlineImage | TextSection | RecipePreview>> = content ?? [];

	return (
		<main>
			<div className="content">
				{blocks.map((block) => (
					<Block key={block._key} content={block} />
				))}
			</div>
		</main>
	);
}
