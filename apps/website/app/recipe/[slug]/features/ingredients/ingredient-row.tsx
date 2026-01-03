import type { Ingredient as IngredientType, Unit } from "@ryan-bakes/sanity-types";
import type Keyed from "@t/keyed";
import IngredientAmount from "./ingredient-amount";
import styles from "./ingredient-row.module.css";

interface Props {
	ingredient: Keyed<IngredientType>;
	units: Unit[];
}

export default function IngredientRow({ ingredient, units }: Props) {
	const { name, amount, unit, notes } = ingredient;

	return (
		<tr>
			<td>{name ?? ""}</td>
			<td>
				{unit && <IngredientAmount amount={amount ?? ""} unit={unit} units={units} />}
				{notes && notes.length > 0 && (
					<>
						{" "}
						<span className={styles.note}>({notes})</span>
					</>
				)}
			</td>
		</tr>
	);
}
