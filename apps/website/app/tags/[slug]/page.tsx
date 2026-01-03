import Heading from "@components/ui/heading";
import getAllTags from "@queries/getAllTags";
import getRecipesByTag from "@queries/getRecipesByTag";
import type { Metadata } from "next";
import Link from "next/link";
import "server-only";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const resolvedParams = params instanceof Promise ? await params : params;
	const { slug } = resolvedParams;

	// convert slug to  title case for metadata
	// replace - with spaces
	const title = slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	const description = `Recipes tagged with "${title}"`;

	return {
		title,
		description,
	};
}

export type Props = Readonly<{
	params: { slug: string } | Promise<{ slug: string }>;
}>;

export default async function Tag({ params }: Props) {
	const resolvedParams = params instanceof Promise ? await params : params;
	const { slug } = resolvedParams;

	const recipes = await getRecipesByTag(slug);

	return (
		<>
			<Heading level={3}>Tag: {slug}</Heading>

			<Heading level={4} sr>
				Recipes
			</Heading>

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
		</>
	);
}

export async function generateStaticParams() {
	const tags = await getAllTags();
	return tags.map((slug) => ({ slug }));
}
