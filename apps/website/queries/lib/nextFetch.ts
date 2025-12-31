export default function nextFetch(url: string, { cache, revalidate }: { cache?: boolean; revalidate?: number } = {}) {
	if (revalidate) {
		return fetch(url, { next: { revalidate } });
	}

	if (cache === false) {
		return fetch(url, { cache: 'no-cache' });
	}

	return fetch(url, { cache: 'force-cache' });
}
