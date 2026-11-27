import FeaturedRecipe from "@components/features/recipe/featured-recipe";
import Heading from "@components/ui/heading";
import buildCanonicalUrl from "@helpers/build-canonical-url";
import formatRecipeCount from "@helpers/format-recipe-count";
import formatTagName from "@helpers/format-tag-name";
import resolveParams from "@helpers/resolve-params";
import tagHref from "@helpers/tag-href";
import getRecipesByTag from "@queries/live/getRecipesByTag";
import getAllTags from "@queries/static/getAllTags";
import type { Recipe } from "@ryan-bakes/sanity-types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "server-only";
import SecondaryFeaturedRecipes from "../../recipe/features/secondary-featured-recipes";
import styles from "./tag-page.module.css";

type RouteParams = Readonly<{ slug: string }>;

export type Props = Readonly<{
	params: RouteParams | Promise<RouteParams>;
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	// Next.js already decodes dynamic params.
	const { slug: tag } = await resolveParams(params);
	const title = formatTagName(tag);

	const description = `Recipes tagged "${title}".`;
	const canonical = buildCanonicalUrl(tagHref(tag));

	return {
		title,
		description,
		alternates: canonical ? { canonical } : undefined,
		keywords: [tag],
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

export default async function Tag({ params }: Props) {
	const { slug: tag } = await resolveParams(params);

	const recipes = await getRecipesByTag(tag);

	// A tag only exists while at least one recipe uses it.
	if (recipes.length === 0) {
		notFound();
	}

	const featuredRecipe = recipes[0];
	const secondaryRecipes = recipes
		.slice(1)
		.map((recipe, index): { recipe: Recipe; index: number } => ({ recipe, index }));

	return (
		<main>
			<div className="content">
				<Heading level={2}>Tag: {formatTagName(tag)}</Heading>
				<p className={styles.summary}>
					{formatRecipeCount(recipes.length)} · <Link href="/tags">All tags</Link>
				</p>

				<FeaturedRecipe recipe={featuredRecipe} priority large />
				{secondaryRecipes.length > 0 && <SecondaryFeaturedRecipes recipes={secondaryRecipes} />}
			</div>
		</main>
	);
}

export async function generateStaticParams(): Promise<RouteParams[]> {
	const tags = await getAllTags();
	return tags.map((slug) => ({ slug }));
}
