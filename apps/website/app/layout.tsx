import MainNav from "@components/menu";
import DisableDraftMode from "@components/ui/disable-draft-mode";
import getSiteConfig from "@queries/live/getSiteConfig";
import { clientEnv } from "@shared/config/env.client";
import { SanityLive } from "@shared/lib/live";
import { VercelToolbar } from "@vercel/toolbar/next";
import type { Metadata, Viewport } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import type { ReactNode } from "react";
import "server-only";
import "../styles/global.css";
import "../styles/variables.css";

export const viewport: Viewport = {
	themeColor: "#0d19a3",
	width: "device-width",
	initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
	const { title, url } = await getSiteConfig();
	const baseUrl = url ?? clientEnv.NEXT_PUBLIC_BASE_URL;

	const defaultTitle = title ?? "Ryan Bakes";
	const defaultDescription = "Browse Ryan Bakes recipes and baking tips.";
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
	const { lang } = await getSiteConfig();
	const { isEnabled } = await draftMode();
	const shouldInjectToolbar = process.env.NODE_ENV === "development" || isEnabled;

	return (
		<html lang={lang}>
			<body>
				<MainNav />
				{children}
				<SanityLive />
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
