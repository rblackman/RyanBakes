import FeaturedRecipe from "@components/features/recipe/featured-recipe";
import Heading from "@components/ui/heading";
import PortableText from "@components/ui/portable-text";
import buildPageMetadata from "@helpers/page-metadata";
import portableTextToPlainText from "@helpers/structured-data/plain-text";
import truncateDescription from "@helpers/truncate-description";
import getRecipeById from "@queries/live/getRecipeById";
import getRecipesPage from "@queries/live/getRecipesPage";
import type { Recipe } from "@ryan-bakes/sanity-types";
import getSiteInfo from "@shared/lib/site-info";
import type { Metadata } from "next";
import { stegaClean } from "next-sanity";
import "server-only";
import SecondaryFeaturedRecipes from "./features/secondary-featured-recipes";

export async function generateMetadata(): Promise<Metadata> {
	const [recipesPage, site] = await Promise.all([getRecipesPage(), getSiteInfo()]);
	const title = stegaClean(recipesPage.title)?.trim() || "Recipes";
	const intro = portableTextToPlainText(stegaClean(recipesPage.intro));
	const description = intro ? truncateDescription(intro) : `Featured recipes from ${site.title}.`;

	return buildPageMetadata({ site, title, description, path: "/recipe" });
}

export default async function Page() {
	const recipesPage = await getRecipesPage();

	const title = recipesPage.title ?? "Recipes";
	const intro = recipesPage.intro ?? [];
	const featuredId = recipesPage.featuredRecipe?._ref;
	const secondaryIds: string[] = (recipesPage.secondaryFeatured ?? [])
		.map((recipe) => recipe?._ref)
		.filter((id): id is string => Boolean(id));

	const recipeIds: string[] = [...new Set([...(featuredId ? [featuredId] : []), ...secondaryIds])];
	const recipesById = new Map<string, Recipe>();

	if (recipeIds.length > 0) {
		await Promise.all(
			recipeIds.map(async (id) => {
				const recipe = await getRecipeById(id);
				recipesById.set(id, recipe);
			}),
		);
	}

	const featuredRecipe = featuredId ? recipesById.get(featuredId) : undefined;
	const secondaryRecipes = secondaryIds
		.map((id, index) => {
			const recipe = recipesById.get(id);
			if (!recipe) {
				return undefined;
			}
			return { recipe, index };
		})
		.filter((value): value is { recipe: Recipe; index: number } => Boolean(value));

	return (
		<div className="content">
			<Heading level={1}>{title}</Heading>

			<div>
				<PortableText value={intro} />
			</div>

			{featuredRecipe && <FeaturedRecipe recipe={featuredRecipe} priority large />}

			{secondaryRecipes.length > 0 && <SecondaryFeaturedRecipes recipes={secondaryRecipes} />}
		</div>
	);
}
