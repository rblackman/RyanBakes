import FeaturedRecipe from "@components/features/recipe/featured-recipe";
import Heading from "@components/ui/heading";
import PortableText from "@components/ui/portable-text";
import getRecipeById from "@queries/getRecipeById";
import getRecipesPage from "@queries/getRecipesPage";
import type { Recipe } from "@ryan-bakes/sanity-types";
import type { Metadata } from "next";
import "server-only";
import SecondaryFeaturedRecipes from "./features/secondary-featured-recipes";

export const metadata: Metadata = {
	title: "Recipes",
	description: "Browse all recipes.",
};

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
		<main>
			<div className="content">
				<Heading level={2}>{title}</Heading>

				<div>
					<PortableText value={intro} />
				</div>

				{featuredRecipe && <FeaturedRecipe recipe={featuredRecipe} priority large />}

				{secondaryRecipes.length > 0 && <SecondaryFeaturedRecipes recipes={secondaryRecipes} />}
			</div>
		</main>
	);
}
