import Heading from "components/generic/heading";
import getAllUnits from "queries/getAllUnits";
import getRecipeBySlug from "queries/getRecipeBySlug";
import "server-only";
import Step from "../step";
import styles from "./steps.module.css";

export default async function Steps({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
	const resolvedParams = params instanceof Promise ? await params : params;
	const { slug } = resolvedParams;
	const [{ ingredients, steps }, units] = await Promise.all([getRecipeBySlug(slug), getAllUnits()]);

	if (!(ingredients && steps)) {
		return null;
	}

	function getIngredientsForIndex(index: number) {
		if (!ingredients || ingredients.length === 0) {
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
					<Step key={step._key} step={step} ingredients={getIngredientsForIndex(i)} units={units} />
				))}
			</ol>
		</>
	);
}
