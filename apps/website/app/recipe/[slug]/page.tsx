import BakersPercentage from "@components/features/bakers-percentage";
import BakeModeToggle from "@components/ui/bake-mode-toggle";
import Tags from "@components/ui/tags";
import buildCanonicalUrl from "@helpers/build-canonical-url";
import resolveParams from "@helpers/resolve-params";
import createImageBuilder from "@hooks/useImageBuilder";
import getAllUnits from "@queries/live/getAllUnits";
import getRecipeBySlug from "@queries/live/getRecipeBySlug";
import getAllRecipeSlugs from "@queries/static/getAllRecipeSlugs";
import type { Ingredient, Step } from "@ryan-bakes/sanity-types";
import { clientEnv } from "@shared/config/env.client";
import type Keyed from "@t/keyed";
import type { Metadata } from "next";
import "server-only";
import RecipeCommentary from "./features/commentary";
import RecipeHero from "./features/hero";
import RecipeIngredients from "./features/ingredients";
import RecipeSteps from "./features/steps";

type RouteParams = Readonly<{ slug: string }>;

export type Props = Readonly<{
	params: RouteParams | Promise<RouteParams>;
}>;

export async function generateMetadata({ params }: Readonly<Props>): Promise<Metadata> {
	const { slug } = await resolveParams(params);

	const recipe = await getRecipeBySlug(slug);

	const recipeTitle = recipe.title ?? "Recipe";
	const description = recipe.description ?? "";
	const ogDescription = recipe.ogDescription ?? description;
	const tags = recipe.tags ?? [];
	const created = recipe._createdAt;
	const updated = recipe._updatedAt;
	const disallowRobots = recipe.disallowRobots ?? false;

	const url = buildCanonicalUrl(`/recipe/${slug}`, clientEnv.NEXT_PUBLIC_BASE_URL);

	const openGraphImage = recipe.openGraphImage ?? recipe.picture;

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
		title: recipeTitle,
		description,
		alternates: url ? { canonical: url } : undefined,
		keywords: tags,
		robots: disallowRobots
			? {
					index: false,
					follow: false,
				}
			: undefined,
		openGraph: {
			type: "article",
			...(url ? { url } : {}),
			title: recipeTitle,
			description: ogDescription,
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
			description: ogDescription,
			images: twitterImage ? [{ url: twitterImage, alt: ogAlt }] : [],
		},
	};
}

export default async function Page({ params }: Readonly<Props>) {
	const { slug } = await resolveParams(params);

	const [recipe, units] = await Promise.all([getRecipeBySlug(slug), getAllUnits()]);
	const tags = recipe.tags ?? [];
	const showBakerPercentage = recipe.showBakerPercentage ?? false;
	const ingredients: Array<Keyed<Ingredient>> = recipe.ingredients ?? [];
	const steps: Array<Keyed<Step>> = recipe.steps ?? [];
	const commentary = recipe.commentary ?? [];

	return (
		<main>
			<RecipeHero recipe={recipe} />
			<div className="content">
				<Tags tags={tags} />
				<RecipeCommentary commentary={commentary} />
				<BakeModeToggle />
				<RecipeIngredients ingredients={ingredients} units={units} />
				{showBakerPercentage && <BakersPercentage ingredients={ingredients} />}
				<RecipeSteps ingredients={ingredients} steps={steps} units={units} />
			</div>
		</main>
	);
}

export async function generateStaticParams(): Promise<RouteParams[]> {
	const slugs = await getAllRecipeSlugs();
	return slugs.map((slug) => ({ slug }));
}
