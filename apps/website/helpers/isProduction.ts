export default function isProduction(): boolean {
	return ["production", "staging"].indexOf(process.env.NODE_ENV) >= 0;
}
