import Footer from "@components/footer";
import MainNav from "@components/menu";
import DisableDraftMode from "@components/ui/disable-draft-mode";
import getSiteConfig from "@queries/live/getSiteConfig";
import { clientEnv } from "@shared/config/env.client";
import { defaultSiteDescription, defaultSiteTitle } from "@shared/config/site-defaults";
import { SanityLive } from "@shared/lib/live";
import { handleLiveEvent } from "@shared/lib/live-action";
import { VercelToolbar } from "@vercel/toolbar/next";
import type { Metadata, Viewport } from "next";
import { EB_Garamond, Source_Sans_3 } from "next/font/google";
import { draftMode } from "next/headers";
import { stegaClean } from "next-sanity";
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
	const { title, url, description } = await getSiteConfig();
	const baseUrl = url ?? clientEnv.NEXT_PUBLIC_BASE_URL;

	const defaultTitle = stegaClean(title)?.trim() || defaultSiteTitle;
	const defaultDescription = stegaClean(description)?.trim() || defaultSiteDescription;
	const metadataBase = baseUrl ? new URL(baseUrl) : undefined;

	return {
		title: {
			template: `${defaultTitle} | %s`,
			default: defaultTitle,
		},
		description: defaultDescription,
		metadataBase,
		openGraph: {
			type: "website",
			...(metadataBase && { url: metadataBase }),
			siteName: defaultTitle,
			title: defaultTitle,
			description: defaultDescription,
		},
		twitter: {
			card: "summary_large_image",
			title: defaultTitle,
			description: defaultDescription,
		},
	};
}

export default async function RootLayout({ children }: { children: ReactNode }) {
	const { lang: rawLang } = await getSiteConfig();
	const lang = stegaClean(rawLang)?.trim() || "en";
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
