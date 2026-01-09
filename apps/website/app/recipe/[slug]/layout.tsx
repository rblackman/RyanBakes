import resolveParams from "@helpers/resolve-params";
import createImageBuilder from "@hooks/useImageBuilder";
import getRecipeBySlug from "@queries/live/getRecipeBySlug";
import "server-only";
import { generateBaseBgUrl } from "./features/hero";

type Props = Readonly<{
	children: React.ReactNode;
	params: Promise<{ slug: string }>;
}>;

export default async function Layout({ children, params }: Props) {
	const { slug } = await resolveParams(params);
	const recipe = await getRecipeBySlug(slug);

	const asset = recipe.picture?.asset;

	let preloadHref: string | null = null;

	if (asset) {
		const imageBuilder = createImageBuilder(asset);
		preloadHref = generateBaseBgUrl(imageBuilder);
	}

	return (
		<>
			{preloadHref && (
				<head>
					<link rel="preload" as="image" href={preloadHref} />
				</head>
			)}
			{children}
		</>
	);
}
