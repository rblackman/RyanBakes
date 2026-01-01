import type { Ingredient as IngredientType, Unit } from "@ryan-bakes/sanity-types";
import "server-only";
import styles from "./(styles)/ingredient.module.css";
import IngredientAmount from "./ingredientAmount";

type Keyed<T> = T & { _key: string };

interface Props {
	ingredient: Keyed<IngredientType>;
	units: Unit[];
}

export default function Ingredient({ ingredient, units }: Props) {
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
