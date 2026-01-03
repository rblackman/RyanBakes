import clsx from "clsx";
import Link from "next/link";
import getRecipeById from "queries/getRecipeById";
import "server-only";
import Heading from "../heading";
import Image from "../image";
import PortableText from "../portableText";
import Tags from "../tags";
import styles from "./featured-recipe.module.css";

type Props = Readonly<{
	id: string;
	priority?: boolean;
	large?: boolean;
}>;

export default async function FeaturedRecipe({ id, priority = false, large = false }: Readonly<Props>) {
	const recipe = await getRecipeById(id);
	const title = recipe.title ?? "";
	const picture = recipe.picture;
	const commentary = recipe.commentary ?? [];
	const tags = recipe.tags ?? [];
	const slug = recipe.slug?.current ?? "";

	const recipeClass = clsx(styles.featuredRecipe, {
		[styles.large]: large,
		[styles.noLarge]: !large,
	});

	return (
		<div className={recipeClass}>
			{picture && (
				<Image
					image={picture}
					width={350}
					aspectRatio={1}
					className={styles.img}
					priority={priority}
					alt={picture.alt ?? ""}
				/>
			)}

			<Heading level={3} className={styles.heading}>
				<Link href={slug ? `/recipe/${slug}` : "/recipe"}>{title}</Link>
			</Heading>

			<div className={styles.tags}>
				<Tags tags={tags} noMargin />
			</div>

			<div className={styles.blurb}>
				<PortableText value={commentary} />
			</div>
		</div>
	);
}
