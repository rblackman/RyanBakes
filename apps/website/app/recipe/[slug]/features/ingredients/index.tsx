import Heading from "@components/ui/heading";
import type { Ingredient as IngredientType, Unit } from "@ryan-bakes/sanity-types";
import type Keyed from "@t/keyed";
import IngredientRow from "./ingredient-row";
import styles from "./ingredients.module.css";

interface Props {
	ingredients: Array<Keyed<IngredientType>>;
	units: Unit[];
}

export default function RecipeIngredients({ ingredients, units }: Props) {
	if (ingredients.length === 0) {
		return null;
	}

	return (
		<>
			<Heading level={3}>Ingredients</Heading>
			<div className={styles.ingredientsTableWrap}>
				<table className={styles.ingredientsTable}>
					<thead className={styles.ingredientsTable_thead}>
						<tr>
							<th scope="col">Ingredient</th>
							<th scope="col">Amount</th>
						</tr>
					</thead>
					<tbody className={styles.ingredientsTable_tbody}>
						{ingredients.map((ingredient) => (
							<IngredientRow key={ingredient._key} ingredient={ingredient} units={units} />
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}
