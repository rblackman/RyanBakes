import getHomepage from "queries/getHomepage";
import "server-only";
import Block from "./(components)/block";

export default async function Page() {
	const { content } = await getHomepage();

	return (
		<main>
			<div className="content">
				{content.map((block) => (
					<Block key={block._key} content={block} />
				))}
			</div>
		</main>
	);
}
