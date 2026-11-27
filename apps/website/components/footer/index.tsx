import MainNavItem from "@components/menu/main-nav-item";
import getNavItems from "@queries/live/getNavItems";
import getSiteConfig from "@queries/live/getSiteConfig";
import { defaultSiteTitle } from "@shared/config/site-defaults";
import Link from "next/link";
import { stegaClean } from "next-sanity";
import "server-only";
import styles from "./footer.module.css";

/** Site footer: the site name and the same links as the main menu, so a long recipe doesn't end in a dead end. */
export default async function Footer() {
	const [{ title }, navItems] = await Promise.all([getSiteConfig(), getNavItems()]);
	const siteName = title && stegaClean(title).trim() ? title : defaultSiteTitle;

	return (
		<div className={styles.footerWrap}>
			<footer className={styles.footer}>
				<p className={styles.siteName}>
					<Link href="/">{siteName}</Link>
				</p>

				{navItems.length > 0 && (
					<nav aria-label="Footer">
						<ul className={styles.navList}>
							{navItems.map(({ id, ...item }) => (
								<li key={id}>
									<MainNavItem item={item} />
								</li>
							))}
						</ul>
					</nav>
				)}
			</footer>
		</div>
	);
}
