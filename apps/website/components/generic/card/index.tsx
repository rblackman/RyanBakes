import type { ImageWithAlt } from "@ryan-bakes/sanity-types";
import Heading from "components/generic/heading";
import Image from "components/generic/image";
import Tags from "components/generic/tags";
import Link from "next/link";
import "server-only";
import styles from "./card.module.css";

type Props = Readonly<{
	title: string;
	tags?: string[] | undefined;
	picture?: ImageWithAlt | undefined;
	href: string;
	index: number;
}>;

export default async function Card({ title, tags, picture, href, index }: Props) {
	return (
		<div className={styles.card} style={{ zIndex: 1000 + index }}>
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
				<Link href={href}>{title}</Link>
			</Heading>

			<div className={styles.tags}>
				<Tags tags={tags ?? []} noMargin small />
			</div>
		</div>
	);
}
