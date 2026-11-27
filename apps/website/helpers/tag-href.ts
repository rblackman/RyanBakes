export default function tagHref(tag: string): string {
	return `/tags/${encodeURIComponent(tag)}`;
}
