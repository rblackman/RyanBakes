import FeaturedRecipe from "@components/generic/featured-recipe";
import type { RecipePreview } from "@ryan-bakes/sanity-types";
import type Keyed from "@t/keyed";
import throwError from "helpers/throwError";
import "server-only";

type Props = Readonly<{
	value: Keyed<RecipePreview>;
}>;

export default async function RecipePreviewComponent({ value: { _key, recipe: recipeRef, large } }: Props) {
	if (recipeRef === undefined) {
		throwError(`RecipePreview block (${_key}) is missing required "recipe" reference.`);
	}

	const { _ref: id } = recipeRef;

	return <FeaturedRecipe id={id} large={large ?? false} />;
}
