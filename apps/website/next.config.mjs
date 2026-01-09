import createWithVercelToolbar from "@vercel/toolbar/plugins/next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import("next").NextConfig} */

const withVercelToolbar = createWithVercelToolbar();
const nextConfig = withVercelToolbar({
	reactStrictMode: true,
	distDir: ".next",
	outputFileTracingRoot: path.join(__dirname, "../../"),
	images: {
		remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
	},
	async redirects() {
		return [
			{
				source: "/studio",
				destination: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
				permanent: false,
			},
		];
	},
});

export default nextConfig;
