import FeaturedRecipe from "components/generic/featured-recipe";
import Heading from "components/generic/heading";
import PortableText from "components/generic/portableText";
import getRecipesPage from "queries/getRecipesPage";
import "server-only";
import SecondaryFeaturedRecipes from "./(components)/secondary-featured-recipes";

export default async function Page() {
	const recipesPage = await getRecipesPage();

	const title = recipesPage.title ?? "Recipes";
	const intro = recipesPage.intro ?? [];
	const featuredId = recipesPage.featuredRecipe?._ref;
	const secondaryIds = (recipesPage.secondaryFeatured ?? [])
		.map(({ _ref }) => _ref)
		.filter((id): id is string => Boolean(id));

	return (
		<main>
			<div className="content">
				<Heading level={2}>{title}</Heading>

				<div>
					<PortableText value={intro} />
				</div>

				{featuredId && <FeaturedRecipe id={featuredId} priority large />}

				{secondaryIds.length > 0 && <SecondaryFeaturedRecipes ids={secondaryIds} />}
			</div>
		</main>
	);
}
