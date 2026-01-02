import type {
	Ingredient,
	InlineImage,
	RecipePreview,
	Step as SanityStep,
	TextSection,
	Unit,
} from "@ryan-bakes/sanity-types";
import Block from "app/(components)/block";
import Heading from "app/(components)/heading";
import "server-only";
import styles from "./(styles)/step.module.css";
import IngredientAmount from "./ingredientAmount";

type Keyed<T> = T & { _key: string };

type StepBlock = Keyed<InlineImage> | Keyed<TextSection> | Keyed<RecipePreview>;

interface Props {
	ingredients: Array<Keyed<Ingredient>>;
	step: Keyed<SanityStep>;
	units: Unit[];
}

export default function Step({ ingredients, step: { title, content }, units }: Props) {
	return (
		<li className={styles.stepWrap}>
			{ingredients && ingredients.length > 0 && (
				<ul className={styles.ingredientsWrap}>
					{ingredients.map(({ _key, amount, name, unit }) => (
						<li key={_key}>
							<IngredientAmount amount={amount ?? ""} units={units} {...(unit ? { unit } : {})} /> &ndash; {name}
						</li>
					))}
				</ul>
			)}
			<div className={styles.directionsWrap}>
				<Heading level={4} style={{ margin: 0 }}>
					{title ?? ""}
				</Heading>
				{(content ?? []).map((block: StepBlock) => {
					const { _key: key } = block;
					return <Block key={key} content={block} />;
				})}
			</div>
		</li>
	);
}
