import Block from "@components/features/content-blocks/block";
import Heading from "@components/ui/heading";
import type {
	Ingredient,
	InlineImage,
	RecipePreview,
	Step as SanityStep,
	TextSection,
	Unit,
} from "@ryan-bakes/sanity-types";
import type Keyed from "@t/keyed";
import IngredientAmount from "../ingredients/ingredient-amount";
import styles from "./step.module.css";

type StepBlock = Keyed<InlineImage> | Keyed<TextSection> | Keyed<RecipePreview>;

interface Props {
	ingredients: Array<Keyed<Ingredient>>;
	step: Keyed<SanityStep>;
	units: Unit[];
}

export default function StepItem({ ingredients, step: { title, content }, units }: Props) {
	const headingTitle = title ?? "";

	return (
		<li className={styles.stepWrap}>
			{ingredients.length > 0 && (
				<ul className={styles.ingredientsWrap}>
					{ingredients.map(({ _key, amount, name, unit }) => {
						const ingredientName = name ?? "";
						return (
							<li key={_key}>
								<IngredientAmount amount={amount ?? ""} units={units} {...(unit ? { unit } : {})} /> &ndash;{" "}
								{ingredientName}
							</li>
						);
					})}
				</ul>
			)}
			<div className={styles.directionsWrap}>
				<Heading level={4} style={{ margin: 0 }}>
					{headingTitle}
				</Heading>
				{(content ?? []).map((block: StepBlock) => {
					const { _key: key } = block;
					return <Block key={key} content={block} />;
				})}
			</div>
		</li>
	);
}
