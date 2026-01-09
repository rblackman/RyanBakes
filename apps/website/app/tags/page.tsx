import Heading from "@components/ui/heading";
import Tags from "@components/ui/tags";
import buildCanonicalUrl from "@helpers/build-canonical-url";
import getTagsPage from "@queries/live/getTagsPage";
import getAllTags from "@queries/static/getAllTags";
import type { Metadata } from "next";
import "server-only";

export async function generateMetadata(): Promise<Metadata> {
	const tagsPage = await getTagsPage();
	const title = tagsPage.title ?? "Tags";
	const featuredTag = tagsPage.featuredTag;
	const description = featuredTag ? `Browse recipes tagged with ${featuredTag} and more.` : "Browse all tags.";
	const canonical = buildCanonicalUrl("/tags");

	return {
		title,
		description,
		alternates: canonical ? { canonical } : undefined,
		openGraph: {
			title,
			description,
			...(canonical ? { url: canonical } : {}),
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
		},
	};
}

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
