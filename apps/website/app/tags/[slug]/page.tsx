import Heading from "components/generic/heading";
import Link from "next/link";
import getAllTags from "queries/getAllTags";
import getRecipesByTag from "queries/getRecipesByTag";
import "server-only";

export type Props = {
	params: { slug: string } | Promise<{ slug: string }>;
};

export default async function Tag({ params }: Readonly<Props>) {
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
