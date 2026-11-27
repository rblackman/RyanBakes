import Heading from "@components/ui/heading";
import Image from "@components/ui/image";
import Tags from "@components/ui/tags";
import type { ImageWithAlt } from "@ryan-bakes/sanity-types";
import Link from "next/link";
import "server-only";
import styles from "./card.module.css";

type Props = Readonly<{
	title: string;
	tags?: string[] | undefined;
	picture?: ImageWithAlt | undefined;
	href: string;
}>;

export default function Card({ title, tags, picture, href }: Props) {
	return (
		<div className={styles.card}>
			{picture && (
				<Image
					image={picture}
					width={480}
					aspectRatio={3 / 2}
					className={styles.pic}
					responsive
					sizes="(max-width: 380px) 100vw, (max-width: 640px) 50vw, 360px"
				/>
			)}

			<Heading level={3} className={styles.name}>
				<Link href={href}>{title}</Link>
			</Heading>

			{tags && tags.length > 0 && (
				<div className={styles.tags}>
					<Tags tags={tags} noMargin small />
				</div>
			)}
		</div>
	);
}
