import type { Metadata, Viewport } from 'next';
import getSiteConfig from 'queries/getSiteConfig';
import type { ReactNode } from 'react';
import 'server-only';
import '../styles/global.css';
import '../styles/variables.css';
import MainNav from './(components)/mainNav';

export const viewport: Viewport = {
	themeColor: '#0d19a3',
	width: 'device-width',
	initialScale: 1
};

export async function generateMetadata(): Promise<Metadata> {
	const { title } = await getSiteConfig();
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

	return {
		title,
		metadataBase: baseUrl ? new URL(baseUrl) : undefined
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
