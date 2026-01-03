import BakeModeToggle from "@components/generic/bake-mode-toggle";
import Tags from "@components/generic/tags";
import createImageBuilder from "@hooks/useImageBuilder";
import { clientEnv } from "@shared/config/env.client";
import type { Metadata } from "next";
import getAllRecipeSlugs from "queries/getAllRecipeSlugs";
import getRecipeBySlug from "queries/getRecipeBySlug";
import getSiteConfig from "queries/getSiteConfig";
import "server-only";
import Commentary from "./(components)/commentary";
import Hero from "./(components)/hero";
import Ingredients from "./(components)/ingredients";
import Steps from "./(components)/steps";

export type Props = {
	params: { slug: string } | Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Readonly<Props>): Promise<Metadata> {
	const resolvedParams = params instanceof Promise ? await params : params;
	const { slug } = resolvedParams;

	const { title: siteTitle } = await getSiteConfig();
	const recipe = await getRecipeBySlug(slug);

	const recipeTitle = recipe.title ?? "";
	const description = recipe.description ?? "";
	const tags = recipe.tags ?? [];
	const created = recipe._createdAt;
	const updated = recipe._updatedAt;

	const baseUrl: string = clientEnv.NEXT_PUBLIC_BASE_URL;
	const url = baseUrl ? new URL(`/recipe/${slug}`, baseUrl).toString() : `/recipe/${slug}`;

	const openGraphImage = recipe.openGraphImage;

	let ogImage: string | undefined;
	let twitterImage: string | undefined;
	let ogAlt: string | undefined;

	if (openGraphImage?.asset) {
		const builder = createImageBuilder(openGraphImage.asset);
		ogImage = builder.buildUrlWithOptions({
			width: 1200,
			height: 627,
			quality: 60,
		});
		twitterImage = builder.buildUrlWithOptions({
			width: 4096,
			height: 2048,
			quality: 60,
		});
		ogAlt = openGraphImage.alt ?? undefined;
	}

	return {
		title: `${siteTitle ?? ""} | ${recipeTitle}`,
		description,
		keywords: tags,
		openGraph: {
			type: "article",
			url,
			title: recipeTitle,
			description,
			images: ogImage
				? [
						{
							url: ogImage,
							alt: ogAlt,
							width: 1200,
							height: 627,
						},
					]
				: [],
			publishedTime: created,
			modifiedTime: updated,
		},
		twitter: {
			card: "summary_large_image",
			title: recipeTitle,
			description,
			images: twitterImage ? [{ url: twitterImage, alt: ogAlt }] : [],
		},
	};
}

export default async function Page(props: Readonly<Props>) {
	const resolvedParams = props.params instanceof Promise ? await props.params : props.params;
	const { slug } = resolvedParams;

	const { tags } = await getRecipeBySlug(slug);

	return (
		<main>
			<Hero {...props} />
			<div className="content">
				<Tags tags={tags ?? []} />
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
