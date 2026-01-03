import Heading from "@components/ui/heading";
import getAllTags from "@queries/getAllTags";
import getRecipesByTag from "@queries/getRecipesByTag";
import type { Metadata } from "next";
import Link from "next/link";
import "server-only";

type RouteParams = Readonly<{ slug: string }>;

export type Props = Readonly<{
	params: RouteParams | Promise<RouteParams>;
}>;

async function resolveParams(params: Props["params"]): Promise<RouteParams> {
	const resolvedParams = params instanceof Promise ? await params : params;
	return resolvedParams;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await resolveParams(params);

	// convert slug to title case for metadata
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

export default async function Tag({ params }: Props) {
	const { slug } = await resolveParams(params);

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

export async function generateStaticParams(): Promise<RouteParams[]> {
	const tags = await getAllTags();
	return tags.map((slug) => ({ slug }));
}
