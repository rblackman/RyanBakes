import Footer from "@components/footer";
import MainNav from "@components/menu";
import DisableDraftMode from "@components/ui/disable-draft-mode";
import { SanityLive } from "@shared/lib/live";
import { handleLiveEvent } from "@shared/lib/live-action";
import getSiteInfo from "@shared/lib/site-info";
import { VercelToolbar } from "@vercel/toolbar/next";
import type { Metadata, Viewport } from "next";
import { EB_Garamond, Source_Sans_3 } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import type { ReactNode } from "react";
import "server-only";
import "../styles/global.css";
import "../styles/variables.css";

// Self-hosted at build time by next/font, so pages make no requests to Google.
// EB Garamond (a classic book serif) for headings; Source Sans 3 for text, tables and controls.
// Headings only. Not preloaded, so it doesn't compete with the page's main photo on slow phones;
// headings show in the size-matched fallback until it arrives.
const headingFont = EB_Garamond({
	subsets: ["latin"],
	display: "swap",
	preload: false,
	variable: "--font-heading",
});

const sourceSans = Source_Sans_3({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-source-sans",
});

export const viewport: Viewport = {
	themeColor: "#163a63",
	width: "device-width",
	initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
	const site = await getSiteInfo();

	// Pages set their own title, description, canonical URL and social cards through
	// buildPageMetadata. These are the defaults for anything that doesn't, plus site-wide values.
	return {
		title: {
			template: `%s | ${site.title}`,
			default: site.title,
		},
		description: site.description,
		applicationName: site.title,
		authors: [{ name: site.authorName, url: site.baseUrl }],
		creator: site.authorName,
		metadataBase: new URL(site.baseUrl),
		// Recipe amounts and times look like phone numbers to some mobile browsers.
		formatDetection: { telephone: false, address: false, email: false },
		openGraph: {
			type: "website",
			url: site.baseUrl,
			siteName: site.title,
			locale: site.locale,
			title: site.title,
			description: site.description,
		},
		twitter: {
			card: "summary",
			title: site.title,
			description: site.description,
		},
	};
}

export default async function RootLayout({ children }: { children: ReactNode }) {
	const { lang } = await getSiteInfo();
	const { isEnabled } = await draftMode();
	const shouldInjectToolbar = process.env.NODE_ENV === "development" || isEnabled;

	return (
		<html lang={lang} className={`${headingFont.variable} ${sourceSans.variable}`}>
			<body>
				<a className="skipLink" href="#main-content">
					Skip to main content
				</a>
				<MainNav />
				<main id="main-content" tabIndex={-1}>
					{children}
				</main>
				<Footer />
				<SanityLive action={handleLiveEvent} />
				{isEnabled ? (
					<>
						<VisualEditing />
						<DisableDraftMode />
					</>
				) : null}
				{shouldInjectToolbar && <VercelToolbar />}
			</body>
		</html>
	);
}
