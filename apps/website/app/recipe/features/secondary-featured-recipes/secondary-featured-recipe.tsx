import Card from "@components/ui/card";
import type { Recipe } from "@ryan-bakes/sanity-types";

type Props = Readonly<{
	recipe: Recipe;
	index: number;
}>;

export default function SecondaryFeaturedRecipe({ recipe, index }: Props) {
	const title = recipe.title ?? "";
	const tags = recipe.tags ?? [];
	const picture = recipe.picture;
	const slug = recipe.slug?.current ?? "";
	const href = slug ? `/recipe/${slug}` : "/recipe";

	return <Card title={title} tags={tags} picture={picture} href={href} index={index} />;
}
