import Heading from "@components/ui/heading";
import Image from "@components/ui/image";
import PortableText from "@components/ui/portable-text";
import Tags from "@components/ui/tags";
import type { Recipe } from "@ryan-bakes/sanity-types";
import clsx from "clsx";
import Link from "next/link";
import styles from "./featured-recipe.module.css";

type Props = Readonly<{
	recipe: Recipe | undefined;
	priority?: boolean;
	large?: boolean;
}>;

export default function FeaturedRecipe({ recipe, priority = false, large = false }: Props) {
	if (!recipe) {
		return null;
	}

	const title = recipe.title ?? "";
	const picture = recipe.picture;
	const commentary = recipe.commentary ?? [];
	const tags = recipe.tags ?? [];
	const slug = recipe.slug?.current ?? "";
	const href = slug ? `/recipe/${slug}` : "/recipe";

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
				<Link href={href}>{title}</Link>
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
