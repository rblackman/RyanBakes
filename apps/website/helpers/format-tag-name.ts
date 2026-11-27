/**
 * Turns a raw recipe tag such as "weeknight" or "gluten-free" into a display name
 * ("Weeknight", "Gluten Free"). The raw tag stays the source for URLs and queries.
 */
export default function formatTagName(tag: string): string {
	return tag
		.trim()
		.split(/[\s-]+/)
		.filter((word) => word.length > 0)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
