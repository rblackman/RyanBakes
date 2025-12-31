import Tags from "app/(components)/tags";
import createImageBuilder from "hooks/useImageBuilder";
import type { Metadata } from "next";
import getAllRecipeSlugs from "queries/getAllRecipeSlugs";
import getRecipeBySlug from "queries/getRecipeBySlug";
import getSiteConfig from "queries/getSiteConfig";
import "server-only";
import { clientEnv } from "shared/config/env.client";
import BakeModeToggle from "./(components)/bakeModeToggle";
import Commentary from "./(components)/commentary";
import Hero from "./(components)/hero";
import Ingredients from "./(components)/ingredients";
import Steps from "./(components)/steps";

export type Props = {
	params: { slug: string } | Promise<{ slug: string }>;
};

export async function generateMetadata({
	params,
}: Readonly<Props>): Promise<Metadata> {
	const resolvedParams = params instanceof Promise ? await params : params;
	const { slug } = resolvedParams;

	const { title: siteTitle } = await getSiteConfig();

	const {
		title: recipeTitle,
		description,
		tags,
		_createdAt: created,
		_updatedAt: updated,
		openGraphImage: { asset, alt },
	} = await getRecipeBySlug(slug);

	const baseUrl: string = clientEnv.NEXT_PUBLIC_BASE_URL;
	const url = baseUrl
		? new URL(`/recipe/${slug}`, baseUrl).toString()
		: `/recipe/${slug}`;
	const builder = createImageBuilder(asset);
	const ogImage = builder.buildUrlWithOptions({
		width: 1200,
		height: 627,
		quality: 0.6,
	});
	const twitterImage = builder.buildUrlWithOptions({
		width: 4096,
		height: 2048,
		quality: 0.6,
	});

	return {
		title: `${siteTitle} | ${recipeTitle}`,
		description,
		keywords: tags,
		openGraph: {
			type: "article",
			url,
			title: recipeTitle,
			description,
			images: [
				{
					url: ogImage,
					alt,
					width: 1200,
					height: 627,
				},
			],
			publishedTime: created,
			modifiedTime: updated,
		},
		twitter: {
			card: "summary_large_image",
			title: recipeTitle,
			description,
			images: [
				{
					url: twitterImage,
					alt,
				},
			],
		},
	};
}

export default async function Page(props: Readonly<Props>) {
	const { params } = props;
	const { slug } = await params;
	const { tags } = await getRecipeBySlug(slug);

	return (
		<main>
			<Hero {...props} />
			<div className="content">
				<Tags tags={tags} />
				<Commentary {...props} />
				<BakeModeToggle />
				<Ingredients {...props} />
				<Steps {...props} />
			</div>
		</main>
	);
}

export async function generateStaticParams() {
	const ids = await getAllRecipeSlugs();
	return ids.map((slug) => ({ slug }));
}
