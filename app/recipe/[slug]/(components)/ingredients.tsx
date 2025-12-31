import Heading from 'app/(components)/heading';
import getAllUnits from 'queries/getAllUnits';
import getRecipeBySlug from 'queries/getRecipeBySlug';
import 'server-only';
import { Props } from '../page';
import styles from './(styles)/ingredients.module.css';
import Ingredient from './ingredient';

export default async function Ingredients({ params: { slug } }: Props) {
	const [{ ingredients }, units] = await Promise.all([getRecipeBySlug(slug), getAllUnits()]);

	if (!ingredients) {
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
							<Ingredient key={ingredient._key} ingredient={ingredient} units={units} />
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}
