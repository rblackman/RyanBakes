import Heading from "@components/ui/heading";
import Image from "@components/ui/image";
import PortableText from "@components/ui/portable-text";
import Tags from "@components/ui/tags";
import type { Recipe } from "@ryan-bakes/sanity-types";
import clsx from "clsx";
import Link from "next/link";
import styles from "./featured-recipe.module.css";

/** The large layout shows a 350px square photo. */
const largeImageWidth = 350;
/** On phones the large layout's photo column is 7rem, 140px at the site's 20px root size; see featured-recipe.module.css. */
const largePhoneImageWidth = 140;
/** The compact layout's photo column is 4.5rem wide, 90px at the site's 20px root size; see featured-recipe.module.css. */
const compactImageWidth = 90;

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
					width={large ? largeImageWidth : compactImageWidth}
					aspectRatio={1}
					className={styles.img}
					responsive
					sizes={
						large ? `(max-width: 640px) ${largePhoneImageWidth}px, ${largeImageWidth}px` : `${compactImageWidth}px`
					}
					preload={priority}
				/>
			)}

			<Heading level={2} className={styles.heading}>
				<Link href={href}>{title}</Link>
			</Heading>

			<div className={styles.tags}>
				<Tags tags={tags} noMargin />
			</div>

			<div className={styles.blurb}>
				<PortableText value={commentary} minHeadingLevel={3} />
			</div>
		</div>
	);
}
