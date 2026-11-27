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
