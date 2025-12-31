import Heading from 'app/(components)/heading';
import getAllUnits from 'queries/getAllUnits';
import getRecipeBySlug from 'queries/getRecipeBySlug';
import 'server-only';
import { Props } from '../page';
import Step from './step';

export default async function Steps({ params: { slug } }: Props) {
	const [{ ingredients, steps }, units] = await Promise.all([getRecipeBySlug(slug), getAllUnits()]);

	if (!(ingredients && steps)) {
		return null;
	}

	const getIngredientsForIndex = (index: number) => ingredients.filter(({ usedInSteps }) => (usedInSteps?.indexOf(index + 1) ?? -1) > -1);

	return (
		<>
			<Heading level={3}>Instructions</Heading>
			<div role="list">
				{steps.map((step, i) => (
					<Step key={step._key} step={step} ingredients={getIngredientsForIndex(i)} units={units} />
				))}
			</div>
		</>
	);
}
