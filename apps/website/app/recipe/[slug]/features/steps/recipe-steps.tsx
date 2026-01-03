import Heading from "@components/ui/heading";
import type { Ingredient, Step as SanityStep, Unit } from "@ryan-bakes/sanity-types";
import type Keyed from "@t/keyed";
import StepItem from "./step-item";
import styles from "./steps.module.css";

interface Props {
	ingredients: Array<Keyed<Ingredient>>;
	steps: Array<Keyed<SanityStep>>;
	units: Unit[];
}

export default function RecipeSteps({ ingredients, steps, units }: Props) {
	if (steps.length === 0) {
		return null;
	}

	function getIngredientsForIndex(index: number): Array<Keyed<Ingredient>> {
		if (ingredients.length === 0) {
			return [];
		}

		return ingredients.filter(({ usedInSteps }) => {
			const usedSteps = usedInSteps ?? [];
			return usedSteps.indexOf(index + 1) > -1;
		});
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
