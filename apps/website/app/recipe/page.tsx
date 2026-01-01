import FeaturedRecipe from "app/(components)/featuredRecipe";
import Heading from "app/(components)/heading";
import PortableText from "app/(components)/portableText";
import getRecipesPage from "queries/getRecipesPage";
import "server-only";
import SecondaryFeaturedRecipes from "./(components)/secondaryFeaturedRecipes";

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

				{featuredId && <FeaturedRecipe id={featuredId} priority />}

				{secondaryIds.length > 0 && <SecondaryFeaturedRecipes ids={secondaryIds} />}
			</div>
		</main>
	);
}
