import { SanityKeyed } from 'sanity-codegen';
import 'server-only';
import { Ingredient as IngredientType, Unit } from 'types/sanity-schema';
import styles from './(styles)/ingredient.module.css';
import IngredientAmount from './ingredientAmount';

interface Props {
	ingredient: SanityKeyed<IngredientType>;
	units: Unit[];
}

export default function Ingredient({ ingredient: { name, amount, unit, notes }, units }: Props) {
	return (
		<tr>
			<td>{name}</td>
			<td>
				<IngredientAmount unit={unit} amount={amount} units={units} />
				{notes && notes.length > 0 && (
					<>
						{' '}
						<span className={styles.note}>({notes})</span>
					</>
				)}
			</td>
		</tr>
	);
}
