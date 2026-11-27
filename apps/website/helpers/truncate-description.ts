/**
 * Shortens text to fit a meta description (about 160 characters, where search engines cut off),
 * breaking at a word and adding an ellipsis. Text that already fits is returned as is.
 */
export default function truncateDescription(text: string, maxLength = 160): string {
	const clean = text.replace(/\s+/g, " ").trim();
	if (clean.length <= maxLength) {
		return clean;
	}

	const cut = clean.slice(0, maxLength - 1);
	const lastSpace = cut.lastIndexOf(" ");
	const base = lastSpace > maxLength / 2 ? cut.slice(0, lastSpace) : cut;
	return `${base.replace(/[\s,.;:]+$/, "")}…`;
}
