import Link from 'next/link';
import getRecipeById from 'queries/getRecipeById';
import 'server-only';
import styles from './(styles)/featuredRecipe.module.css';
import Heading from './heading';
import Image from './image';
import PortableText from './portableText';
import Tags from './tags';

interface Props {
	id: string;
	priority?: boolean;
}

export default async function FeaturedRecipe({ id, priority }: Readonly<Props>) {
	const {
		title,
		picture,
		commentary,
		tags,
		slug: { current: slug }
	} = await getRecipeById(id);

	return (
		<div className={styles['featuredRecipe']}>
			<Image image={picture} width={350} aspectRatio={1} className={styles['img']} priority={priority === true} alt={picture.alt} />
			<Heading level={3} className={styles['heading']}>
				<Link href={`/recipe/${slug}`}>{title}</Link>
			</Heading>
			<div className={styles['tags']}>
				<Tags tags={tags} noMargin />
			</div>
			<div className={styles['blurb']}>
				<PortableText value={commentary} />
				<PortableText value={commentary} />
			</div>
		</div>
	);
}

FeaturedRecipe.defaultProps = {
	priority: false
};
