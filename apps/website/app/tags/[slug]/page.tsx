import FeaturedRecipe from "@components/features/recipe/featured-recipe";
import Heading from "@components/ui/heading";
import JsonLd from "@components/ui/json-ld";
import formatRecipeCount from "@helpers/format-recipe-count";
import formatTagName from "@helpers/format-tag-name";
import buildPageMetadata from "@helpers/page-metadata";
import resolveParams from "@helpers/resolve-params";
import buildBreadcrumbJsonLd from "@helpers/structured-data/breadcrumbs";
import tagHref from "@helpers/tag-href";
import getRecipesByTag from "@queries/live/getRecipesByTag";
import getAllTags from "@queries/static/getAllTags";
import type { Recipe } from "@ryan-bakes/sanity-types";
import getSiteInfo from "@shared/lib/site-info";
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
	const site = await getSiteInfo();
	const name = formatTagName(tag);

	return buildPageMetadata({
		site,
		title: `${name} recipes`,
		description: `${name} recipes from ${site.title}, with exact amounts and step-by-step instructions.`,
		path: tagHref(tag),
		keywords: [tag],
	});
}

export default async function Tag({ params }: Props) {
	const { slug: tag } = await resolveParams(params);

	const [recipes, site] = await Promise.all([getRecipesByTag(tag), getSiteInfo()]);

	// A tag only exists while at least one recipe uses it.
	if (recipes.length === 0) {
		notFound();
	}

	const featuredRecipe = recipes[0];
	const secondaryRecipes = recipes
		.slice(1)
		.map((recipe, index): { recipe: Recipe; index: number } => ({ recipe, index }));

	const tagUrl = new URL(tagHref(tag), site.baseUrl).toString();
	const breadcrumbs = buildBreadcrumbJsonLd([
		{ name: "Home", url: site.baseUrl },
		{ name: "Tags", url: new URL("/tags", site.baseUrl).toString() },
		{ name: formatTagName(tag), url: tagUrl },
	]);

	return (
		<div className="content">
			{breadcrumbs && <JsonLd data={breadcrumbs} />}
			<Heading level={1}>Tag: {formatTagName(tag)}</Heading>
			<p className={styles.summary}>
				{formatRecipeCount(recipes.length)} · <Link href="/tags">All tags</Link>
			</p>

			<FeaturedRecipe recipe={featuredRecipe} priority large />
			{secondaryRecipes.length > 0 && <SecondaryFeaturedRecipes recipes={secondaryRecipes} />}
		</div>
	);
}

export async function generateStaticParams(): Promise<RouteParams[]> {
	const tags = await getAllTags();
	return tags.map((slug) => ({ slug }));
}
