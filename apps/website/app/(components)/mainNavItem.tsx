import assertUnreachable from "helpers/assertUnreachable";
import Link from "next/link";
import type { NavItemQueryResult } from "queries/getNavItems";
import styles from "./(styles)/mainNavItem.module.css";

interface Props {
	item: Omit<NavItemQueryResult, "id">;
}

export default function MainNavItem({
	item: {
		name,
		pageInfo: { type, slug },
	},
}: Props) {
	let url: string;
	switch (type) {
		case "page": {
			const currentSlug = slug?.current;
			url = currentSlug ? `/${currentSlug}` : "/";
			break;
		}
		case "recipesPage": {
			url = "/recipe";
			break;
		}
		case "tagsPage": {
			url = "/tags";
			break;
		}
		default: {
			assertUnreachable(type);
		}
	}
	return (
		<Link className={styles.mainNavItem} href={url}>
			{name}
		</Link>
	);
}
