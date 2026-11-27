import Heading from "@components/ui/heading";
import table from "@components/ui/table/table.module.css";
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
	if (totalFlourWeight === 0) {
		// don't divide by zero
		return 0;
	}

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
	if (a.isFlour && !b.isFlour) {
		return -1;
	}
	if (!a.isFlour && b.isFlour) {
		return 1;
	}
	// Second: non-liquid ingredients come before liquid
	if (!a.countsTowardHydration && b.countsTowardHydration) {
		return -1;
	}
	if (a.countsTowardHydration && !b.countsTowardHydration) {
		return 1;
	}
	// Finally: sort by name
	if (b.grams - a.grams !== 0) {
		return b.grams - a.grams;
	}
	return a.name.localeCompare(b.name);
}

export default function BakersPercentageTable({ heading, headingLevel = 2, ingredients }: Props) {
	const totalFlourWeight = calculateTotalFlourWeight(ingredients);
	const totalHydration = calculateTotalHydration(ingredients, totalFlourWeight);
	const sorted = [...ingredients].sort(ingredientCompare);

	return (
		<>
			<Heading level={headingLevel}>{heading}</Heading>
			<p className={styles.hydration}>
				<strong>{totalHydration.toFixed(1)}%</strong> hydration
			</p>
			<div className={table.wrap}>
				<table className={table.table}>
					<caption className="sr">Baker's Percentage Table</caption>
					<thead>
						<tr>
							<th scope="col">Ingredient</th>
							<th scope="col" className={table.num}>
								Grams
							</th>
							<th scope="col" className={table.num}>
								Baker's %
							</th>
						</tr>
					</thead>
					<tbody>
						{sorted.map(({ name, grams, key }) => {
							const bakersPercentage = totalFlourWeight > 0 ? (grams / totalFlourWeight) * 100 : 0;
							return (
								<tr key={key}>
									<td>{name}</td>
									<td className={table.num}>{grams.toFixed(0)}</td>
									<td className={table.num}>{bakersPercentage.toFixed(1)}%</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</>
	);
}
