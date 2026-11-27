import type { CustomValidator } from "sanity";
import blockToString from "./blockToString";

const apiVersion = "2025-01-01";
const placeholderPattern = /\blorem\s+ipsum\b/i;
const tagUsageQuery = `count(*[_type == "recipe" && $recipeTag in tags])`;

/**
 * Warns when Portable Text still contains "lorem ipsum" placeholder copy.
 * Use as a warning so editors can still save work in progress.
 */
export const warnOnPlaceholderText: CustomValidator<unknown[] | undefined> = (blocks) => {
	if (!Array.isArray(blocks)) {
		return true;
	}

	if (placeholderPattern.test(blockToString(blocks))) {
		return "This looks like placeholder text (lorem ipsum). Replace it before publishing.";
	}

	return true;
};

/**
 * Warns when a tag is not used by any recipe. The website skips such tags, so a typo here
 * silently hides the featured tag.
 */
export const warnOnUnusedTag: CustomValidator<string | undefined> = async (tag, context) => {
	const trimmed = tag?.trim();
	if (!trimmed) {
		return true;
	}

	const client = context.getClient({ apiVersion });
	const count = await client.fetch<number>(tagUsageQuery, { recipeTag: trimmed });

	if (count > 0) {
		return true;
	}

	return `No recipe uses the tag "${trimmed}", so it will not show on the site. Tags must match exactly, including case.`;
};

// A single quantity: "2", "0.25", ".5", "1/2" or "1 1/2".
const quantity = String.raw`(?:\d+\s+\d+/\d+|\d+/\d+|\d+(?:\.\d+)?|\.\d+)`;
const numericAmountPattern = new RegExp(String.raw`^${quantity}(?:\s*-\s*${quantity})?$`);
const wordAmountPattern = /^[A-Za-z][A-Za-z\s'-]*$/;
const fractionPattern = /(\d+)\/(\d+)/g;
const commaDecimalPattern = /^\d+,\d+$/;
const unitInAmountPattern = /^[\d\s./-]+[A-Za-z]/;
const amountHelp = "Use a number (2, 0.25), a fraction (1/2, 1 1/2), a range (2-3) or a word such as Pinch.";

/**
 * Checks the shape of an ingredient amount. The website turns decimals into fractions for units
 * shown as fractions, so the amount has to be something it can read.
 */
export const validateAmount: CustomValidator<string | undefined> = (amount) => {
	const trimmed = amount?.trim();
	if (!trimmed) {
		return true;
	}

	if (commaDecimalPattern.test(trimmed)) {
		return `Use a dot for decimals, e.g. ${trimmed.replace(",", ".")}.`;
	}

	if (wordAmountPattern.test(trimmed)) {
		return true;
	}

	if (!numericAmountPattern.test(trimmed)) {
		if (unitInAmountPattern.test(trimmed)) {
			return `Put the unit in the Unit field, not in the amount. ${amountHelp}`;
		}
		return amountHelp;
	}

	for (const [, numerator, denominator] of trimmed.matchAll(fractionPattern)) {
		if (Number(denominator) === 0) {
			return `${numerator}/${denominator} divides by zero.`;
		}
	}

	return true;
};

const servesPattern = /^(\d+)(?:\s*-\s*(\d+))?$/;

/** Checks that servings are a whole number or a low-high range such as 4-6. */
export const validateServes: CustomValidator<string | undefined> = (serves) => {
	const trimmed = serves?.trim();
	if (!trimmed) {
		return true;
	}

	const match = servesPattern.exec(trimmed);
	if (!match) {
		return "Use a whole number such as 4, or a range such as 4-6.";
	}

	const [, low, high] = match;
	if (high !== undefined && Number(high) <= Number(low)) {
		return `Put the smaller number first, e.g. ${high}-${low}.`;
	}

	return true;
};

type DocumentWithSteps = { steps?: unknown } | undefined;

function stepCount(document: unknown): number {
	const steps = (document as DocumentWithSteps)?.steps;
	return Array.isArray(steps) ? steps.length : 0;
}

/**
 * Errors when an ingredient points at a step that does not exist. The website matches ingredients
 * to steps by number, so a wrong number hides the ingredient from that step.
 */
export const validateUsedInSteps: CustomValidator<number[] | undefined> = (used, context) => {
	if (!Array.isArray(used) || used.length === 0) {
		return true;
	}

	const count = stepCount(context.document);
	const missing = used.filter((n) => !Number.isInteger(n) || n < 1 || n > count);
	if (missing.length === 0) {
		return true;
	}

	const label = missing.length > 1 ? `Steps ${missing.join(", ")} do not exist` : `Step ${missing[0]} does not exist`;
	return `${label}. This recipe has ${count} step${count === 1 ? "" : "s"}. Untick it or add the step.`;
};

/** Warns when an ingredient is not linked to any step, so it never shows next to a step. */
export const warnOnUnusedIngredient: CustomValidator<number[] | undefined> = (used) => {
	if (Array.isArray(used) && used.length > 0) {
		return true;
	}

	return "Not used in any step yet, so it only shows in the ingredient list.";
};

/** Warns when the bake time is longer than the total time. */
export const warnOnBakeTimeOverTotal: CustomValidator<number | undefined> = (bakeTime, context) => {
	const total = (context.document as { totalTime?: unknown } | undefined)?.totalTime;
	if (typeof bakeTime !== "number" || typeof total !== "number") {
		return true;
	}

	if (bakeTime > total) {
		return `Bake time (${bakeTime} min) is longer than the total time (${total} min).`;
	}

	return true;
};

const duplicateUnitQuery = `count(*[_type == "unit" && lower(name) == lower($name) && !(_id in [$draftId, $publishedId]) && !(_id in path("versions.**"))])`;

/** Warns when another unit already has the same name, so ingredients don't end up split across copies. */
export const warnOnDuplicateUnit: CustomValidator<string | undefined> = async (name, context) => {
	const trimmed = name?.trim();
	const id = context.document?._id;
	if (!trimmed || !id) {
		return true;
	}

	const publishedId = id.replace(/^drafts\./, "");
	const client = context.getClient({ apiVersion });
	const count = await client.fetch<number>(duplicateUnitQuery, {
		name: trimmed,
		draftId: `drafts.${publishedId}`,
		publishedId,
	});

	if (count > 0) {
		return `Another unit is already called "${trimmed}". Reuse it instead of adding a copy.`;
	}

	return true;
};
