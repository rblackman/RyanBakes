import 'server-only';
import Query from 'types/query';
import { Unit } from 'types/sanity-schema';
import buildGroqQuery from './lib/buildGroqQuery';
import nextFetch from './lib/nextFetch';

export default async function getAllUnits(): Promise<Unit[]> {
	const url = buildGroqQuery(`*[ _type == 'unit' ]`);
	const response = await nextFetch(url);
	var { result } = (await response.json()) as Query<Unit>;
	return result;
}
