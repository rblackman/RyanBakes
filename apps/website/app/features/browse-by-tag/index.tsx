import Heading from "@components/ui/heading";
import formatRecipeCount from "@helpers/format-recipe-count";
import formatTagName from "@helpers/format-tag-name";
import tagHref from "@helpers/tag-href";
import type { TagSummary } from "@queries/live/getTagSummaries";
import Link from "next/link";
import "server-only";
import styles from "./browse-by-tag.module.css";

const tagLimit = 8;

type Props = Readonly<{
	summaries: ReadonlyArray<TagSummary>;
}>;

/** The most used tags (ties broken alphabetically), plus links to the full lists. */
export default function BrowseByTag({ summaries }: Props) {
	const popular = [...summaries].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag)).slice(0, tagLimit);

	return (
		<section aria-labelledby="browse-heading">
			<Heading level={2} id="browse-heading">
				Find a recipe
			</Heading>

			{popular.length > 0 && (
				<ul className={styles.tagList}>
					{popular.map(({ tag, count }) => (
						<li key={tag}>
							<Link className={styles.tagLink} href={tagHref(tag)}>
								{formatTagName(tag)}
								<span className={styles.count}>{formatRecipeCount(count)}</span>
							</Link>
						</li>
					))}
				</ul>
			)}

			<p className={styles.more}>
				<Link href="/recipe">Browse all recipes</Link>
				{summaries.length > 0 && (
					<>
						{" "}
						or <Link href="/tags">see every tag</Link>
					</>
				)}
				.
			</p>
		</section>
	);
}
