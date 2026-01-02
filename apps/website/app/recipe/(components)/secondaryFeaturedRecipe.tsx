import Heading from "app/(components)/heading";
import Image from "app/(components)/image";
import Tags from "app/(components)/tags";
import Link from "next/link";
import getRecipeById from "queries/getRecipeById";
import "server-only";
import styles from "./(styles)/secondaryFeaturedRecipe.module.css";

interface Props {
	id: string;
	index: number;
}

export default async function SecondaryFeaturedRecipe({ id, index }: Props) {
	const recipe = await getRecipeById(id);

	const title = recipe.title ?? "";
	const tags = recipe.tags ?? [];
	const picture = recipe.picture;
	const slug = recipe.slug?.current ?? "";

	return (
		<div className={styles.recipeCard} style={{ zIndex: 1000 + index }}>
			{picture && (
				<Image
					image={picture}
					width={400}
					aspectRatio={300 / 125}
					className={styles.pic}
					responsive
					alt={picture.alt ?? ""}
				/>
			)}

			<Heading level={4} className={styles.name}>
				<Link href={slug ? `/recipe/${slug}` : "/recipe"}>{title}</Link>
			</Heading>

			<div className={styles.tags}>
				<Tags tags={tags} noMargin small />
			</div>
		</div>
	);
}
