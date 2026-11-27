import BakersPercentage from "@components/features/bakers-percentage";
import BakeModeToggle from "@components/ui/bake-mode-toggle";
import JsonLd from "@components/ui/json-ld";
import Tags from "@components/ui/tags";
import buildPageMetadata, { type SocialImage } from "@helpers/page-metadata";
import resolveParams from "@helpers/resolve-params";
import buildBreadcrumbJsonLd from "@helpers/structured-data/breadcrumbs";
import buildRecipeJsonLd from "@helpers/structured-data/recipe";
import type { JsonLd as JsonLdData } from "@helpers/structured-data/types";
import getAllUnits from "@queries/live/getAllUnits";
import getRecipeBySlug from "@queries/live/getRecipeBySlug";
import getAllRecipeSlugs from "@queries/static/getAllRecipeSlugs";
import type { Ingredient, Step } from "@ryan-bakes/sanity-types";
import { socialImageUrl } from "@shared/lib/image";
import getSiteInfo from "@shared/lib/site-info";
import type Keyed from "@t/keyed";
import type { Metadata } from "next";
import { stegaClean } from "next-sanity";
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
	const [recipe, site] = await Promise.all([getRecipeBySlug(slug), getSiteInfo()]);

	const title = stegaClean(recipe.title)?.trim() || "Recipe";
	const description = stegaClean(recipe.description)?.trim();
	// The sharing description and image are optional and fall back to the main description and picture.
	const sharingDescription = stegaClean(recipe.ogDescription)?.trim();
	const sharingImage = recipe.openGraphImage?.asset ? recipe.openGraphImage : recipe.picture;
	const tags = stegaClean(recipe.tags ?? []);

	let ogImage: SocialImage | undefined;
	let twitterImage: SocialImage | undefined;

	if (sharingImage?.asset) {
		const alt = sharingImage.emptyAlt ? undefined : stegaClean(sharingImage.alt)?.trim() || undefined;
		ogImage = { url: socialImageUrl(sharingImage, 1200, 630), width: 1200, height: 630, alt };
		twitterImage = { url: socialImageUrl(sharingImage, 1200, 600), width: 1200, height: 600, alt };
	}

	return buildPageMetadata({
		site,
		title,
		description,
		socialDescription: sharingDescription,
		path: `/recipe/${slug}`,
		type: "article",
		ogImage,
		twitterImage,
		noIndex: recipe.disallowRobots === true,
		keywords: tags,
		article: { publishedTime: recipe._createdAt, modifiedTime: recipe._updatedAt, tags },
	});
}

export default async function Page({ params }: Readonly<Props>) {
	const { slug } = await resolveParams(params);

	const [recipe, units, site] = await Promise.all([getRecipeBySlug(slug), getAllUnits(), getSiteInfo()]);
	const tags = recipe.tags ?? [];
	const showBakerPercentage = recipe.showBakerPercentage ?? false;
	const ingredients: Array<Keyed<Ingredient>> = recipe.ingredients ?? [];
	const steps: Array<Keyed<Step>> = recipe.steps ?? [];
	const commentary = recipe.commentary ?? [];

	const url = new URL(`/recipe/${slug}`, site.baseUrl).toString();
	const recipeJsonLd = buildRecipeJsonLd({
		recipe,
		units,
		url,
		author: { "@type": "Person", name: site.authorName, url: site.baseUrl },
		imageUrl: socialImageUrl,
	});
	const breadcrumbs = buildBreadcrumbJsonLd([
		{ name: "Home", url: site.baseUrl },
		{ name: "Recipes", url: new URL("/recipe", site.baseUrl).toString() },
		{ name: stegaClean(recipe.title) ?? "", url },
	]);
	const structuredData = [recipeJsonLd, breadcrumbs].flatMap((item): JsonLdData[] => (item ? [item] : []));

	return (
		<>
			{structuredData.length > 0 && <JsonLd data={structuredData} />}
			<RecipeHero recipe={recipe} />
			<div className="content">
				<Tags tags={tags} />
				<RecipeCommentary commentary={commentary} />
				<BakeModeToggle />
				<RecipeIngredients ingredients={ingredients} units={units} />
				{showBakerPercentage && <BakersPercentage ingredients={ingredients} />}
				<RecipeSteps ingredients={ingredients} steps={steps} units={units} />
			</div>
		</>
	);
}

export async function generateStaticParams(): Promise<RouteParams[]> {
	const slugs = await getAllRecipeSlugs();
	return slugs.map((slug) => ({ slug }));
}
