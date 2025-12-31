import Heading from 'app/(components)/heading';
import 'server-only';
import styles from './(styles)/secondaryFeaturedRecipes.module.css';
import SecondaryFeaturedRecipe from './secondaryFeaturedRecipe';

interface Props {
	ids: string[];
}

export default function SecondaryFeaturedRecipes({ ids }: Props) {
	return (
		<>
			<Heading level={3} sr>
				Other Recipes
			</Heading>
			<div className={styles.secondaryGrid}>
				{ids.map((id, index) => (
					<SecondaryFeaturedRecipe key={id} id={id} index={index} />
				))}
			</div>
		</>
	);
}
