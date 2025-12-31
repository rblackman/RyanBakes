import nextConfig from 'eslint-config-next';

const config = [
	...nextConfig,
	{
		ignores: ['node_modules', 'public']
	}
];

export default config;
