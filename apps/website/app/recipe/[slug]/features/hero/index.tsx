import Heading from "@components/ui/heading";
import type { Recipe } from "@ryan-bakes/sanity-types";
import { sanityImageProject } from "@shared/lib/image";
import { Image as SanityImage } from "next-sanity/image";
import RecipeMeta from "../meta";
import styles from "./hero.module.css";

type Props = Readonly<{
	recipe: Recipe;
}>;

export default function RecipeHero({ recipe }: Props) {
	const title = recipe.title ?? "";
	const picture = recipe.picture;
	const metaProps = {
		preheat: recipe.preheat,
		bakeTime: recipe.bakeTime,
		totalTime: recipe.totalTime,
		serves: recipe.serves,
	};

	return (
		<div className={styles.heroContainer}>
			{picture?.asset && (
				// The likely LCP element: a real <img> (not a CSS background) so the browser finds it in
				// the HTML, preloaded with a srcset. `fill` lets each breakpoint's aspect ratio crop it,
				// and next-sanity positions the crop around the Studio hotspot.
				<SanityImage
					src={picture}
					{...sanityImageProject}
					fill
					sizes="100vw"
					preload
					fetchPriority="high"
					className={styles.heroImage}
					alt={picture.emptyAlt || !picture.alt ? "" : picture.alt}
				/>
			)}
			<div className={styles.headingWrap}>
				<Heading level={1} className={styles.heading}>
					{title}
				</Heading>
				<RecipeMeta {...metaProps} />
			</div>
		</div>
	);
}
