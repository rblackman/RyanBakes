import { useMemo } from "react";
import "server-only";
import styles from "./(styles)/tags.module.css";
import Tag from "./tag";

interface Props {
	tags: string[];
	noMargin?: boolean;
	small?: boolean;
}

export default function Tags({ tags, noMargin }: Props) {
	const sorted = useMemo(() => [...tags].sort(), [tags]);

	const noMarginClass = noMargin === true ? styles.noMargin : null;
	const mainClass = styles.tagList;
	const smallClass = styles.small;
	const className = `${mainClass} ${noMarginClass} ${smallClass}`.trimEnd();

	return (
		<ul className={className}>
			{sorted.map((tag) => (
				<Tag tag={tag} key={tag} />
			))}
		</ul>
	);
}

Tags.defaultProps = {
	noMargin: false,
	small: false,
};
