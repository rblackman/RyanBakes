import Heading from "@components/ui/heading";
import type { BakerPercentageEntry } from ".";
import styles from "./baker-table.module.css";

type Props = Readonly<{
	heading: string;
	headingLevel?: 2 | 3;
	ingredients: BakerPercentageEntry[];
}>;

function calculateTotalFlourWeight(ingredients: BakerPercentageEntry[]): number {
	return ingredients.reduce((sum, ingredient) => {
		return ingredient.isFlour ? sum + ingredient.grams : sum;
	}, 0);
}

function calculateTotalHydration(ingredients: BakerPercentageEntry[], totalFlourWeight: number): number {
	return (
		(ingredients.reduce((sum, ingredient) => {
			if (ingredient.countsTowardHydration) {
				return sum + ingredient.grams * ingredient.hydrationFactor;
			}
			return sum;
		}, 0) /
			totalFlourWeight) *
		100
	);
}

function ingredientCompare(a: BakerPercentageEntry, b: BakerPercentageEntry): number {
	// First: flour ingredients come first
	if (a.isFlour && !b.isFlour) return -1;
	if (!a.isFlour && b.isFlour) return 1;
	// Second: non-liquid ingredients come before liquid
	if (!a.countsTowardHydration && b.countsTowardHydration) return -1;
	if (a.countsTowardHydration && !b.countsTowardHydration) return 1;
	// Finally: sort by name
	if (b.grams - a.grams !== 0) {
		return b.grams - a.grams;
	}
	return a.name.localeCompare(b.name);
}

export default function BakersPercentageTable({ heading, headingLevel = 3, ingredients }: Props) {
	const totalFlourWeight = calculateTotalFlourWeight(ingredients);
	const totalHydration = calculateTotalHydration(ingredients, totalFlourWeight);
	const sorted = ingredients.sort(ingredientCompare);

	return (
		<>
			<Heading level={headingLevel}>
				{heading} (<em>{totalHydration.toFixed(1)}% hydration</em>)
			</Heading>
			<div className={styles.percentageTableWrap}>
				<table className={styles.percentageTable}>
					<thead className={styles.percentageTable_thead}>
						<tr>
							<th>Ingredient</th>
							<th>Grams</th>
							<th>Baker's %</th>
						</tr>
					</thead>
					<tbody className={styles.percentageTable_tbody}>
						{sorted.map(({ name, grams, key }) => {
							const bakersPercentage = totalFlourWeight > 0 ? (grams / totalFlourWeight) * 100 : 0;
							return (
								<tr key={key}>
									<td>{name}</td>
									<td>{grams.toFixed(0)}</td>
									<td>{bakersPercentage.toFixed(1)}%</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</>
	);
}
