import Tag from "@components/ui/tag";
import clsx from "clsx";
import "server-only";
import styles from "./tags.module.css";

interface Props {
	tags: string[];
	noMargin?: boolean;
	small?: boolean;
}

export default function Tags({ tags, noMargin = false, small = false }: Props) {
	const sorted = [...tags].sort();

	const className = clsx(styles.tagList, {
		[styles.noMargin]: noMargin,
		[styles.small]: small,
	});

	return (
		<ul className={className}>
			{sorted.map((tag) => {
				return <Tag tag={tag} key={tag} />;
			})}
		</ul>
	);
}
