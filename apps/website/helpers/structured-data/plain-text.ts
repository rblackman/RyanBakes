type BlockLike = {
	_type?: string;
	children?: Array<{ text?: string }>;
};

/**
 * Flattens Portable Text blocks into one plain string: the text of each block, separated by a space.
 * Non-text blocks (images, recipe cards) are skipped. Whitespace is collapsed so the result reads as
 * one paragraph in search results.
 */
export default function portableTextToPlainText(blocks: ReadonlyArray<BlockLike> | undefined | null): string {
	if (!blocks) {
		return "";
	}

	return blocks
		.filter((block) => block._type === "block")
		.map((block) => (block.children ?? []).map((child) => child.text ?? "").join(""))
		.join(" ")
		.replace(/\s+/g, " ")
		.trim();
}
