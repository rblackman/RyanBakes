import 'server-only';
import Query from 'types/query';
import { Page } from 'types/sanity-schema';
import buildGroqQuery from './lib/buildGroqQuery';
import nextFetch from './lib/nextFetch';

export default async function getPageById(id: string): Promise<Page> {
	if (!id || id.length === 0) {
		throw new Error('Must provide an id');
	}

	const url = buildGroqQuery(`*[ _type == 'page' && _id == '${id}' ]`);

	const response = await nextFetch(url);
	const { status, statusText } = response;

	if (status !== 200) {
		throw new Error(`Got a ${status} response: ${statusText}`);
	}

	const { result } = (await response.json()) as Query<Page>;

	if (result.length === 0) {
		throw new Error(`Could not find page with id: ${id}`);
	}

	if (result.length > 1) {
		console.warn(`Got more than one page with id ${id}. Using the first.`, { id, result });
	}

	return result[0];
}
