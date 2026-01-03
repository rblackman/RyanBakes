import getNavItems from "@queries/getNavItems";
import getSiteConfig from "@queries/getSiteConfig";
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
				<h1 className={styles.siteName}>
					<Link href="/">{title}</Link>
				</h1>

				<nav className={styles.nav}>
					<ul className={styles.navList}>
						{mainNav.map(({ id, ...item }) => (
							<li key={id} className={styles.navListItem}>
								<MainNavItem item={item} />
							</li>
						))}
					</ul>
				</nav>
			</header>
		</div>
	);
}
