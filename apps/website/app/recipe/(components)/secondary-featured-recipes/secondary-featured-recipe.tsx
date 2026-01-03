import Card from "@components/generic/card";
import getRecipeById from "queries/getRecipeById";
import "server-only";

interface Props {
	id: string;
	index: number;
}

export default async function SecondaryFeaturedRecipe({ id, index }: Props) {
	const recipe = await getRecipeById(id);

	const title = recipe.title ?? "";
	const tags = recipe.tags ?? [];
	const picture = recipe.picture;
	const slug = recipe.slug?.current ?? "";
	const href = slug ? `/recipe/${slug}` : "/recipe";

	return <Card title={title} tags={tags} picture={picture} href={href} index={index} />;
}
