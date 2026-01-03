import Block from "@components/generic/block";
import getHomepage from "queries/getHomepage";
import "server-only";

export default async function Page() {
	const { content } = await getHomepage();

	return (
		<main>
			<div className="content">
				{content?.map((block) => (
					<Block key={block._key} content={block} />
				))}
			</div>
		</main>
	);
}
