import PortableText from "@components/ui/portable-text";
import type { TypedObject } from "@portabletext/types";
import styles from "./commentary.module.css";

type Props = Readonly<{
	commentary: TypedObject[] | undefined;
}>;

export default function RecipeCommentary({ commentary }: Props) {
	if (!commentary || commentary.length === 0) {
		return null;
	}

	return (
		<div className={styles.introWrap}>
			<PortableText value={commentary} />
		</div>
	);
}
