import FeaturedRecipe from "@components/features/recipe/featured-recipe";
import throwError from "@helpers/throw-error";
import getRecipeById from "@queries/live/getRecipeById";
import type { RecipePreview } from "@ryan-bakes/sanity-types";
import type Keyed from "@t/keyed";
import "server-only";

type Props = Readonly<{
	value: Keyed<RecipePreview>;
}>;

export default async function RecipePreviewComponent({ value: { _key, recipe: recipeRef, large } }: Props) {
	if (recipeRef === undefined) {
		throwError(`RecipePreview block (${_key}) is missing required "recipe" reference.`);
	}

	const { _ref: id } = recipeRef;

	const recipe = await getRecipeById(id);

	return <FeaturedRecipe recipe={recipe} large={large ?? false} />;
}
