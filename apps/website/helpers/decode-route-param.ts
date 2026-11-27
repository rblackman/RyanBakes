/**
 * Decodes a dynamic route segment. Next.js may hand over a segment still percent-encoded
 * (for example a tag with a space), and a malformed sequence must not crash the page.
 */
export default function decodeRouteParam(value: string): string {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}
