import Heading from "@components/ui/heading";
import table from "@components/ui/table/table.module.css";
import type { Ingredient as IngredientType, Unit } from "@ryan-bakes/sanity-types";
import type Keyed from "@t/keyed";
import IngredientRow from "./ingredient-row";

type Props = Readonly<{
	ingredients: Array<Keyed<IngredientType>>;
	units: Unit[];
}>;

export default function RecipeIngredients({ ingredients, units }: Props) {
	if (ingredients.length === 0) {
		return null;
	}

	return (
		<>
			<Heading level={2}>Ingredients</Heading>
			<div className={table.wrap}>
				<table className={table.table}>
					<thead>
						<tr>
							<th scope="col">Ingredient</th>
							<th scope="col">Amount</th>
						</tr>
					</thead>
					<tbody>
						{ingredients.map((ingredient) => (
							<IngredientRow key={ingredient._key} ingredient={ingredient} units={units} />
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}
