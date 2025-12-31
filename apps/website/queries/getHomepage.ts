import 'server-only';
import { Page } from 'types/sanity-schema';
import getPageById from './getPageById';
import getSiteConfig from './getSiteConfig';

export default async function getHomepage(): Promise<Page> {
	const {
		homepage: { _ref: ref }
	} = await getSiteConfig();
	const page = await getPageById(ref);
	return page;
}
