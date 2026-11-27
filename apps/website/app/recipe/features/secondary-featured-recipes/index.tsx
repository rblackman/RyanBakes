import Heading from "@components/ui/heading";
import type { Recipe } from "@ryan-bakes/sanity-types";
import SecondaryFeaturedRecipe from "./secondary-featured-recipe";
import styles from "./secondary-featured-recipes.module.css";

type Props = Readonly<{
	recipes: Array<{ recipe: Recipe; index: number }>;
}>;

export default function SecondaryFeaturedRecipes({ recipes }: Props) {
	if (recipes.length === 0) {
		return null;
	}

	return (
		<>
			<Heading level={2} sr>
				Other Recipes
			</Heading>
			<ul className={styles.secondaryGrid}>
				{recipes.map(({ recipe, index }) => (
					<li key={recipe._id ? `${recipe._id}-${index}` : `idx-${index}`}>
						<SecondaryFeaturedRecipe recipe={recipe} />
					</li>
				))}
			</ul>
		</>
	);
}
