import PortableText from 'app/(components)/portableText';
import getRecipeBySlug from 'queries/getRecipeBySlug';
import 'server-only';
import { Props } from '../page';
import styles from './(styles)/commentary.module.css';

export default async function Commentary({ params: { slug } }: Props) {
	const { commentary } = await getRecipeBySlug(slug);
	return (
		<div className={styles.introWrap}>
			<PortableText value={commentary} />
		</div>
	);
}
