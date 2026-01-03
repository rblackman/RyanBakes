import throwError from "@helpers/throw-error";
import type { Ingredient } from "@ryan-bakes/sanity-types";
import BakersPercentageTable from "./baker-percentage-table";

type Props = Readonly<{
	ingredients: Ingredient[];
}>;

export type BakerPercentageEntry = {
	name: string;
	grams: number;
	isFlour: boolean;
	countsTowardHydration: boolean;
	hydrationFactor: number;
	key: string;
};

export default function BakersPercentage({ ingredients }: Props) {
	const ingredientsWithBakersPercentage: Readonly<BakerPercentageEntry[]> = ingredients
		.filter(({ name, bakers }) => name && bakers && bakers.includeInBakersMath === true)
		.map(({ name, bakers }) => ({
			name: name ?? throwError("Ingredient name is missing."),
			bakers: bakers ?? throwError("Bakers data is missing."),
		}))
		.map(({ name, bakers: { grams, isFlour, countsTowardHydration, hydrationFactor } }) => ({
			name,
			grams: grams ?? throwError(`Grams missing for ingredient: ${name}`),
			isFlour: isFlour ?? false,
			countsTowardHydration: countsTowardHydration ?? false,
			hydrationFactor: hydrationFactor ?? 1,
			key: `${name}|${isFlour ? "1" : "0"}|${countsTowardHydration ? "1" : "0"}|${hydrationFactor ?? 1}`,
		}));

	const mergedBakerPercentages: BakerPercentageEntry[] = Object.values(
		ingredientsWithBakersPercentage.reduce<Record<string, BakerPercentageEntry>>((acc, curr) => {
			const { key, grams } = curr;
			if (acc[key]) {
				acc[key].grams += grams;
			} else {
				acc[key] = { ...curr };
			}
			return acc;
		}, {}),
	);

	return <BakersPercentageTable heading="Baker's Percentage" ingredients={mergedBakerPercentages} />;
}
