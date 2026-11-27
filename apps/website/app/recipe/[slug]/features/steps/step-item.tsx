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

type Props = Readonly<{
	ingredients: Array<Keyed<Ingredient>>;
	/** 1-based position. Gives the step an anchor (#step-1) that the recipe's structured data links to. */
	number: number;
	step: Keyed<SanityStep>;
	units: Unit[];
}>;

export default function StepItem({ ingredients, number, step: { title, content }, units }: Props) {
	const headingTitle = title ?? "";

	return (
		<li className={styles.stepWrap} id={`step-${number}`}>
			{ingredients.length > 0 && (
				<ul className={styles.ingredientsWrap}>
					{ingredients.map(({ _key, amount, name, unit }) => {
						const ingredientName = name ?? "";
						// Show the quantity when there is a number, or a unit that renders on its own ("to taste").
						const resolvedUnit = units.find(({ _id }) => {
							return _id === unit?._ref;
						});
						const hasAmount =
							(amount ?? "").trim().length > 0 || (resolvedUnit !== undefined && resolvedUnit.noUnit !== true);
						return (
							<li key={_key}>
								{hasAmount && (
									<>
										<span className={styles.amount}>
											<IngredientAmount amount={amount ?? ""} units={units} {...(unit ? { unit } : {})} />
										</span>{" "}
									</>
								)}
								<span className={styles.ingredientName}>{ingredientName}</span>
							</li>
						);
					})}
				</ul>
			)}
			<div className={styles.directionsWrap}>
				<Heading level={3} className={styles.stepHeading}>
					{headingTitle}
				</Heading>
				{(content ?? []).map((block: StepBlock) => {
					const { _key: key } = block;
					return <Block key={key} content={block} minHeadingLevel={4} />;
				})}
			</div>
		</li>
	);
}
