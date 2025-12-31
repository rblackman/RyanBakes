import Distinct from 'helpers/distinct';
import 'server-only';
import Query from 'types/query';
import { Recipe } from 'types/sanity-schema';
import buildGroqQuery from './lib/buildGroqQuery';
import nextFetch from './lib/nextFetch';

export default async function getAllTags(): Promise<string[]> {
	const url = buildGroqQuery(`*[ _type == 'recipe' ]{ tags }`);
	const response = await nextFetch(url);
	const { result } = (await response.json()) as Query<Pick<Recipe, 'tags'>>;
	return Distinct(result.reduce<string[]>((acc, { tags }) => acc.concat(tags), []));
}
