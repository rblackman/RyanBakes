import Heading from "@components/generic/heading";
import getAllUnits from "queries/getAllUnits";
import getRecipeBySlug from "queries/getRecipeBySlug";
import "server-only";
import Ingredient from "../ingredient";
import styles from "./ingredients.module.css";

export default async function Ingredients({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
	const resolvedParams = params instanceof Promise ? await params : params;
	const { slug } = resolvedParams;

	const [{ ingredients }, units] = await Promise.all([getRecipeBySlug(slug), getAllUnits()]);

	if (!ingredients || ingredients.length === 0) {
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
