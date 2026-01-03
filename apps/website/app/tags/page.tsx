import Heading from "@components/ui/heading";
import Tags from "@components/ui/tags";
import getAllTags from "@queries/getAllTags";
import type { Metadata } from "next";
import "server-only";

export const metadata: Metadata = {
	title: "Tags",
	description: "Browse all tags.",
};

export default async function Page() {
	const tags = await getAllTags();
	const hasTags = tags.length > 0;

	return (
		<main>
			<div className="content">
				<Heading level={2}>Tags</Heading>
				<p>Browse recipes by tag.</p>

				{hasTags ? <Tags tags={tags} /> : <p>No tags available yet.</p>}
			</div>
		</main>
	);
}
