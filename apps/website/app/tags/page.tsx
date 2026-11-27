import Heading from "@components/ui/heading";
import PortableText from "@components/ui/portable-text";
import buildCanonicalUrl from "@helpers/build-canonical-url";
import formatRecipeCount from "@helpers/format-recipe-count";
import formatTagName from "@helpers/format-tag-name";
import tagHref from "@helpers/tag-href";
import getTagSummaries, { type TagSummary } from "@queries/live/getTagSummaries";
import getTagsPage from "@queries/live/getTagsPage";
import type { Metadata } from "next";
import Link from "next/link";
import { stegaClean } from "next-sanity";
import { BiPurchaseTagAlt } from "react-icons/bi";
import "server-only";
import styles from "./tags-page.module.css";

const featuredRecipeLimit = 3;

type TagSummaryProps = Readonly<{
	summary: TagSummary;
}>;

function TagWithCount({ summary: { tag, count } }: TagSummaryProps) {
	return (
		<li className={styles.tagItem}>
			<Link className={styles.tagLink} href={tagHref(tag)}>
				<BiPurchaseTagAlt aria-hidden="true" className={styles.tagIcon} />
				<span>{formatTagName(tag)}</span>
			</Link>
			<span className={styles.count}>{formatRecipeCount(count)}</span>
		</li>
	);
}

function FeaturedTag({ summary: { tag, count, recipes } }: TagSummaryProps) {
	const shown = recipes.slice(0, featuredRecipeLimit);
	const name = formatTagName(tag);

	return (
		<li className={styles.featuredCard}>
			<Heading level={3} className={styles.featuredHeading}>
				<Link href={tagHref(tag)}>{name}</Link>
			</Heading>
			<p className={styles.count}>{formatRecipeCount(count)}</p>
			<ul className={styles.featuredRecipes}>
				{shown.map((recipe) => (
					<li key={recipe.slug}>
						<Link href={`/recipe/${recipe.slug}`}>{recipe.title}</Link>
					</li>
				))}
			</ul>
			{count > shown.length && (
				<Link className={styles.seeAll} href={tagHref(tag)}>
					See all {count} {name} recipes
				</Link>
			)}
		</li>
	);
}

/**
 * Resolves the editor-chosen featured tags against tags that recipes actually use, in the
 * editor's order, without duplicates. Tags no recipe uses are skipped (the Studio warns about them).
 */
function resolveFeatured(featuredTag: string | undefined, secondary: string[] | undefined, summaries: TagSummary[]) {
	const byTag = new Map(summaries.map((summary) => [summary.tag, summary]));
	const wanted = [featuredTag, ...(secondary ?? [])]
		.map((tag) => stegaClean(tag)?.trim())
		.filter((tag): tag is string => Boolean(tag));

	return [...new Set(wanted)]
		.map((tag) => byTag.get(tag))
		.filter((summary): summary is TagSummary => summary !== undefined);
}

export async function generateMetadata(): Promise<Metadata> {
	const tagsPage = await getTagsPage();
	const title = stegaClean(tagsPage.title) ?? "Tags";
	const description = "Browse every recipe by tag.";
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
	const [tagsPage, summaries] = await Promise.all([getTagsPage(), getTagSummaries()]);

	const title = tagsPage.title ?? "Tags";
	const intro = tagsPage.intro ?? [];
	const featured = resolveFeatured(tagsPage.featuredTag, tagsPage.secondaryFeature, summaries);

	return (
		<div className="content">
			<Heading level={1}>{title}</Heading>

			{intro.length > 0 && (
				<div className={styles.intro}>
					<PortableText value={intro} />
				</div>
			)}

			{featured.length > 0 && (
				<section aria-labelledby="featured-tags">
					<Heading level={2} id="featured-tags">
						Featured tags
					</Heading>
					<ul className={styles.featuredList}>
						{featured.map((summary) => (
							<FeaturedTag key={summary.tag} summary={summary} />
						))}
					</ul>
				</section>
			)}

			<section aria-labelledby="all-tags">
				<Heading level={2} id="all-tags">
					All tags
				</Heading>
				{summaries.length > 0 ? (
					<ul className={styles.tagList}>
						{summaries.map((summary) => (
							<TagWithCount key={summary.tag} summary={summary} />
						))}
					</ul>
				) : (
					<p>
						No recipes have tags yet. <Link href="/recipe">Browse all recipes</Link> instead.
					</p>
				)}
			</section>
		</div>
	);
}
