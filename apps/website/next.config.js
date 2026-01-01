// ./apps/website/next.config.js
import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	outputFileTracingRoot: path.join(__dirname, "../../"),
	images: {
		remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
	},
};

export default nextConfig;
