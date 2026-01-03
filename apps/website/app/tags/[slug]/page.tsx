import Heading from "@components/ui/heading";
import buildCanonicalUrl from "@helpers/build-canonical-url";
import getAllTags from "@queries/getAllTags";
import getRecipesByTag from "@queries/getRecipesByTag";
import type { Metadata } from "next";
import Link from "next/link";
import "server-only";

function formatTagTitle(slug: string): string {
	return slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const resolvedParams = params instanceof Promise ? await params : params;
	const { slug } = resolvedParams;

	// convert slug to title case for metadata
	// replace - with spaces
	const title = formatTagTitle(slug);

	const description = `Recipes tagged with "${title}"`;
	const canonical = buildCanonicalUrl(`/tags/${slug}`);

	return {
		title,
		description,
		alternates: canonical ? { canonical } : undefined,
		keywords: [slug],
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

export type Props = Readonly<{
	params: { slug: string } | Promise<{ slug: string }>;
}>;

export default async function Tag({ params }: Props) {
	const resolvedParams = params instanceof Promise ? await params : params;
	const { slug } = resolvedParams;
	const tagTitle = formatTagTitle(slug);

	const recipes = await getRecipesByTag(slug);

	return (
		<main>
			<div className="content">
				<Heading level={2}>Tag: {tagTitle}</Heading>

				<Heading level={3} sr>
					Recipes tagged with {tagTitle}
				</Heading>

				{recipes.length > 0 ? (
					<ul>
						{recipes.map(({ _id: id, title, slug: recipeSlug }) => {
							const recipeSlugValue = recipeSlug?.current;

							if (!recipeSlugValue) {
								return null;
							}

							return (
								<li key={id}>
									<Link href={`/recipe/${recipeSlugValue}`}>{title ?? "Untitled"}</Link>
								</li>
							);
						})}
					</ul>
				) : (
					<p>No recipes available for this tag yet.</p>
				)}
			</div>
		</main>
	);
}

export async function generateStaticParams() {
	const tags = await getAllTags();
	return tags.map((slug) => ({ slug }));
}
