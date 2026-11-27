import Heading from "@components/ui/heading";
import "server-only";
import styles from "./home-hero.module.css";

type Props = Readonly<{
	tagline: string;
	description: string;
}>;

export default function HomeHero({ tagline, description }: Props) {
	return (
		<section className={styles.hero} aria-labelledby="home-tagline">
			<Heading level={1} id="home-tagline" className={styles.tagline}>
				{tagline}
			</Heading>
			<p className={styles.description}>{description}</p>
		</section>
	);
}
