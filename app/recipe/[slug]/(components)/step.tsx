import Block from 'app/(components)/block';
import Heading from 'app/(components)/heading';
import { SanityKeyed } from 'sanity-codegen';
import 'server-only';
import { Ingredient as IngredientType, Step as SanityStep, Unit } from 'types/sanity-schema';
import styles from './(styles)/step.module.css';
import IngredientAmount from './ingredientAmount';

interface Props {
	ingredients: Array<SanityKeyed<IngredientType>>;
	step: SanityKeyed<SanityStep>;
	units: Unit[];
}
export default function Step({ ingredients, step: { title, content }, units }: Props) {
	return (
		<div className={styles.stepWrap} role="listitem">
			{ingredients && ingredients.length > 0 && (
				<ul className={styles.ingredientsWrap}>
					{ingredients.map(({ _key, name, amount, unit }) => (
						<li key={_key}>
							<IngredientAmount amount={amount} unit={unit} units={units} /> {name}
						</li>
					))}
				</ul>
			)}
			<div className={styles.directionsWrap}>
				<Heading level={4} style={{ margin: 0 }}>
					{title}
				</Heading>
				{content.map((block) => {
					const { _key: key } = block;
					return <Block key={key} content={block} />;
				})}
			</div>
		</div>
	);
}
