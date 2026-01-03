import Heading from "components/generic/heading";
import "server-only";
import SecondaryFeaturedRecipe from "./secondary-featured-recipe";
import styles from "./secondary-featured-recipes.module.css";

interface Props {
	ids: string[];
}

export default function SecondaryFeaturedRecipes({ ids }: Props) {
	return (
		<>
			<Heading level={3} sr>
				Other Recipes
			</Heading>
			<div className={styles.secondaryGrid}>
				{ids.map((id, index) => (
					<SecondaryFeaturedRecipe key={id} id={id} index={index} />
				))}
			</div>
		</>
	);
}
