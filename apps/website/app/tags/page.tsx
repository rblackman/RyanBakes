import buildCanonicalUrl from "@helpers/build-canonical-url";
import getTagsPage from "@queries/getTagsPage";
import type { Metadata } from "next";

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

export default function Page() {
	return (
		<main>
			<div className="content">
				<p>TAGS PAGE</p>
			</div>
		</main>
	);
}
