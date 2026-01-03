import Heading from "@components/ui/heading";
import type { Ingredient, Step as SanityStep, Unit } from "@ryan-bakes/sanity-types";
import type Keyed from "@t/keyed";
import { useCallback } from "react";
import StepItem from "./step-item";
import styles from "./steps.module.css";

type Props = Readonly<{
	ingredients: Array<Keyed<Ingredient>>;
	steps: Array<Keyed<SanityStep>>;
	units: Unit[];
}>;

export default function RecipeSteps({ ingredients, steps, units }: Props) {
	const getIngredientsForIndex = useCallback(
		(index: number) => {
			if (ingredients.length === 0) {
				return [];
			}

			return ingredients.filter(({ usedInSteps }) => {
				const usedSteps = usedInSteps ?? [];
				return usedSteps.indexOf(index + 1) > -1;
			});
		},
		[ingredients],
	);

	if (steps.length === 0) {
		return null;
	}

	return (
		<>
			<Heading level={3}>Instructions</Heading>
			<ol className={styles.ol}>
				{steps.map((step, i) => (
					<StepItem key={step._key} step={step} ingredients={getIngredientsForIndex(i)} units={units} />
				))}
			</ol>
		</>
	);
}
