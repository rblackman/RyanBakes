import { normalizeAmountToFractions } from "@components/ui/fraction/decimal-to-fraction";
import type { Ingredient, InlineImage, Recipe, Step, Unit } from "@ryan-bakes/sanity-types";
import minutesToIsoDuration from "./duration";
import portableTextToPlainText from "./plain-text";
import type { JsonLdHowToStep, JsonLdPerson, JsonLdRecipe } from "./types";

/** Builds a fixed-size image URL. Injected so this module stays free of env and server-only imports. */
export type ImageUrlBuilder = (
	image: NonNullable<Recipe["picture"]> | InlineImage,
	width: number,
	height: number,
) => string;

export type RecipeJsonLdInput = Readonly<{
	recipe: Recipe;
	units: ReadonlyArray<Unit>;
	/** Absolute canonical URL of the recipe page. */
	url: string;
	author?: JsonLdPerson | undefined;
	imageUrl: ImageUrlBuilder;
}>;

// Google asks for several high-resolution images in 16x9, 4x3 and 1x1, each at least 50,000 pixels.
const recipeImageSizes = [
	[1200, 675],
	[1200, 900],
	[1200, 1200],
] as const;

const stepImageSize = [1200, 900] as const;

const servesRange = /^(\d+)\s*(?:-|–|to)\s*(\d+)$/;
const servesSingle = /^\d+$/;

function clean(value: string | undefined | null): string | undefined {
	const trimmed = value?.replace(/\s+/g, " ").trim();
	return trimmed ? trimmed : undefined;
}

/**
 * The amount, unit and name as one line, the way the recipe page shows it: "300 g Bread Flour",
 * "1 1/2 cup Milk (warm)". Units set to Fraction turn decimals into fractions; noCount and noUnit
 * units hide the amount or the unit. Returns undefined for an ingredient with no name.
 */
export function formatIngredient(ingredient: Ingredient, units: ReadonlyArray<Unit>): string | undefined {
	const name = clean(ingredient.name);
	if (!name) {
		return undefined;
	}

	const unit = units.find(({ _id }) => _id === ingredient.unit?._ref);
	const rawAmount = clean(ingredient.amount) ?? "";

	let amount = rawAmount;
	if (unit?.noCount === true) {
		amount = "";
	} else if (unit?.display === "Fraction") {
		amount = normalizeAmountToFractions(rawAmount);
	}

	const unitText = unit && unit.noUnit !== true ? (clean(unit.abbreviation) ?? clean(unit.name) ?? "") : "";
	const notes = clean(ingredient.notes);

	const line = [amount, unitText, name].filter((part) => part.length > 0).join(" ");
	return notes ? `${line} (${notes})` : line;
}

/**
 * schema.org recipeYield: a bare number first (Google asks for the servings as just a number), then
 * the readable text. "4-6" gives ["4", "4-6 servings"], using the low end of a range. Text that is not
 * a number or a range is passed through as written.
 */
export function formatYield(serves: string | undefined): string[] | undefined {
	const value = clean(serves);
	if (!value) {
		return undefined;
	}

	if (servesSingle.test(value)) {
		return [value, `${value} ${value === "1" ? "serving" : "servings"}`];
	}

	const range = servesRange.exec(value);
	if (range) {
		const [, low, high] = range;
		return [`${low}`, `${low}-${high} servings`];
	}

	return [value];
}

function stepImage(step: Step, imageUrl: ImageUrlBuilder): string | undefined {
	const image = (step.content ?? []).find(
		(block): block is InlineImage & { _key: string } => block._type === "inlineImage" && Boolean(block.asset),
	);
	return image ? imageUrl(image, stepImageSize[0], stepImageSize[1]) : undefined;
}

/**
 * One HowToStep per step. The step title is the name; the text is the step's written content, or the
 * title when a step has no text. Each step links to its anchor on the page (#step-1, #step-2, ...),
 * which matches the ids the steps list renders.
 */
export function buildInstructions(
	steps: ReadonlyArray<Step>,
	url: string,
	imageUrl: ImageUrlBuilder,
): JsonLdHowToStep[] {
	return steps.flatMap((step, index): JsonLdHowToStep[] => {
		const name = clean(step.title);
		const textBlocks = (step.content ?? []).flatMap((block) =>
			block._type === "textSection" ? (block.text ?? []) : [],
		);
		const text = clean(portableTextToPlainText(textBlocks)) ?? name;

		if (!text) {
			return [];
		}

		const image = stepImage(step, imageUrl);

		return [
			{
				"@type": "HowToStep",
				...(name && name !== text ? { name } : {}),
				text,
				url: `${url}#step-${index + 1}`,
				...(image ? { image } : {}),
			},
		];
	});
}

/**
 * Builds schema.org Recipe JSON-LD from a Sanity recipe, following Google's Recipe structured data
 * guidelines. Every property comes from the recipe; anything empty or unusable is left out rather than
 * sent with a placeholder. Returns undefined when the recipe has no title, since `name` is required.
 *
 * Times: totalTime and cookTime (bakeTime) come straight from the recipe. prepTime is the difference,
 * only when both are set and the bake time is shorter. Google wants prepTime and cookTime together,
 * so a lone bake time is still emitted as cookTime with totalTime.
 */
export default function buildRecipeJsonLd({
	recipe,
	units,
	url,
	author,
	imageUrl,
}: RecipeJsonLdInput): JsonLdRecipe | undefined {
	const name = clean(recipe.title);
	if (!name) {
		return undefined;
	}

	const picture = recipe.picture?.asset ? recipe.picture : undefined;
	const images = picture ? recipeImageSizes.map(([width, height]) => imageUrl(picture, width, height)) : [];

	const totalMinutes = recipe.totalTime;
	const cookMinutes = recipe.bakeTime;
	const prepMinutes =
		typeof totalMinutes === "number" && typeof cookMinutes === "number" && totalMinutes > cookMinutes
			? totalMinutes - cookMinutes
			: undefined;

	const totalTime = minutesToIsoDuration(totalMinutes);
	const cookTime = minutesToIsoDuration(cookMinutes);
	const prepTime = minutesToIsoDuration(prepMinutes);

	const tags = (recipe.tags ?? []).map((tag) => clean(tag)).filter((tag): tag is string => Boolean(tag));
	const ingredients = (recipe.ingredients ?? [])
		.map((ingredient) => formatIngredient(ingredient, units))
		.filter((line): line is string => Boolean(line));
	const instructions = buildInstructions(recipe.steps ?? [], url, imageUrl);
	const description = clean(recipe.description);
	const recipeYield = formatYield(recipe.serves);

	return {
		"@context": "https://schema.org",
		"@type": "Recipe",
		"@id": `${url}#recipe`,
		name,
		url,
		mainEntityOfPage: url,
		...(images.length > 0 ? { image: images } : {}),
		...(description ? { description } : {}),
		...(author ? { author } : {}),
		...(recipe._createdAt ? { datePublished: recipe._createdAt } : {}),
		...(recipe._updatedAt ? { dateModified: recipe._updatedAt } : {}),
		...(prepTime ? { prepTime } : {}),
		...(cookTime ? { cookTime } : {}),
		...(totalTime ? { totalTime } : {}),
		...(recipeYield ? { recipeYield } : {}),
		...(tags.length > 0 ? { keywords: tags.join(", ") } : {}),
		...(ingredients.length > 0 ? { recipeIngredient: ingredients } : {}),
		...(instructions.length > 0 ? { recipeInstructions: instructions } : {}),
	};
}
