import getNavItems from "@queries/live/getNavItems";
import getSiteConfig from "@queries/live/getSiteConfig";
import Link from "next/link";
import "server-only";
import styles from "./main-nav.module.css";
import MainNavItem from "./main-nav-item";

export default async function MainNav() {
	const { title } = await getSiteConfig();
	const mainNav = await getNavItems();

	return (
		<div className={styles.headerWrap}>
			<header className={styles.header}>
				{/* Not a heading: each page's own title is its h1. */}
				<p className={styles.siteName}>
					<Link href="/">{title}</Link>
				</p>

				<nav aria-label="Main">
					<ul className={styles.navList}>
						{mainNav.map(({ id, ...item }) => (
							<li key={id}>
								<MainNavItem item={item} />
							</li>
						))}
					</ul>
				</nav>
			</header>
		</div>
	);
}
