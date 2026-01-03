"use client";
import Link from "next/link";
import { BiPurchaseTagAlt } from "react-icons/bi";
import styles from "./tag.module.css";

type Props = Readonly<{
	tag: string;
}>;

export default function Tag({ tag }: Props) {
	const encodedTag = encodeURIComponent(tag);

	return (
		<li key={tag} className={styles.tagListItem}>
			<Link className={styles.tagLink} href={`/tags/${encodedTag}`}>
				<BiPurchaseTagAlt className={styles.tagLink_Svg} />
				<span className={styles.tagLink_Tag}> {tag}</span>
			</Link>
		</li>
	);
}
