import MainNav from "@components/menu";
import getSiteConfig from "@queries/getSiteConfig";
import { clientEnv } from "@shared/config/env.client";
import type { Metadata, Viewport } from "next";
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
	const { title } = await getSiteConfig();
	const baseUrl = clientEnv.NEXT_PUBLIC_BASE_URL;

	const defaultTitle = title ?? "Ryan Bakes";
	return {
		title: {
			template: `${defaultTitle} | %s`,
			default: defaultTitle,
		},
		metadataBase: baseUrl ? new URL(baseUrl) : undefined,
	};
}

export default async function RootLayout({ children }: { children: ReactNode }) {
	const { lang } = await getSiteConfig();

	return (
		<html lang={lang}>
			<body>
				<MainNav />
				{children}
			</body>
		</html>
	);
}
