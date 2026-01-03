import PortableText from "components/generic/portableText";
import getRecipeBySlug from "queries/getRecipeBySlug";
import "server-only";
import type { Props } from "../../page";
import styles from "./commentary.module.css";

export default async function Commentary({ params }: Readonly<Props>) {
	const resolvedParams = params instanceof Promise ? await params : params;
	const { slug } = resolvedParams;

	const { commentary } = await getRecipeBySlug(slug);

	return (
		<div className={styles.introWrap}>
			<PortableText value={commentary ?? []} />
		</div>
	);
}
