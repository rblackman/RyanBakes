import type { Metadata } from "next";

export type SocialImage = Readonly<{
	url: string;
	width: number;
	height: number;
	alt?: string | undefined;
}>;

type Site = Readonly<{
	title: string;
	baseUrl: string;
	locale: string;
}>;

export type PageMetadataInput = Readonly<{
	site: Site;
	/** The page's own title. The root layout's template adds the site name unless `absoluteTitle` is set. */
	title: string;
	absoluteTitle?: boolean | undefined;
	description?: string | undefined;
	/** Description for Open Graph and Twitter cards. Defaults to `description`. */
	socialDescription?: string | undefined;
	/** Path of the page, e.g. /recipe/detroit-pizza. Resolved against the site's base URL. */
	path: string;
	ogImage?: SocialImage | undefined;
	twitterImage?: SocialImage | undefined;
	type?: "website" | "article" | undefined;
	/** Ask search engines not to index the page or follow its links. */
	noIndex?: boolean | undefined;
	article?:
		| Readonly<{
				publishedTime?: string | undefined;
				modifiedTime?: string | undefined;
				tags?: ReadonlyArray<string> | undefined;
		  }>
		| undefined;
	keywords?: ReadonlyArray<string> | undefined;
}>;

function canonicalFor(path: string, baseUrl: string): string | undefined {
	try {
		return new URL(path.startsWith("/") ? path : `/${path}`, baseUrl).toString();
	} catch {
		return undefined;
	}
}

/**
 * Metadata for one page: title, description, canonical URL, Open Graph and Twitter card, and robots.
 *
 * Next.js replaces a parent's `openGraph` and `twitter` objects instead of merging them, so every page
 * builds both in full here (site name, locale, type) rather than relying on the root layout.
 * The Twitter card is the large-image card only when there is an image.
 */
export default function buildPageMetadata({
	site,
	title,
	absoluteTitle,
	description,
	socialDescription,
	path,
	ogImage,
	twitterImage,
	type = "website",
	noIndex,
	article,
	keywords,
}: PageMetadataInput): Metadata {
	const canonical = canonicalFor(path, site.baseUrl);
	const trimmedDescription = description?.trim() || undefined;
	const socialTitle = title;
	const cardDescription = socialDescription?.trim() || trimmedDescription;
	const twitterCardImage = twitterImage ?? ogImage;

	const openGraphImages = ogImage
		? [{ url: ogImage.url, width: ogImage.width, height: ogImage.height, ...(ogImage.alt ? { alt: ogImage.alt } : {}) }]
		: undefined;

	const twitterImages = twitterCardImage
		? [{ url: twitterCardImage.url, ...(twitterCardImage.alt ? { alt: twitterCardImage.alt } : {}) }]
		: undefined;

	const sharedOpenGraph = {
		siteName: site.title,
		locale: site.locale,
		title: socialTitle,
		...(cardDescription ? { description: cardDescription } : {}),
		...(canonical ? { url: canonical } : {}),
		...(openGraphImages ? { images: openGraphImages } : {}),
	};

	const openGraph: Metadata["openGraph"] =
		type === "article"
			? {
					...sharedOpenGraph,
					type: "article",
					...(article?.publishedTime ? { publishedTime: article.publishedTime } : {}),
					...(article?.modifiedTime ? { modifiedTime: article.modifiedTime } : {}),
					...(article?.tags && article.tags.length > 0 ? { tags: [...article.tags] } : {}),
				}
			: { ...sharedOpenGraph, type: "website" };

	return {
		title: absoluteTitle ? { absolute: title } : title,
		...(trimmedDescription ? { description: trimmedDescription } : {}),
		...(keywords && keywords.length > 0 ? { keywords: [...keywords] } : {}),
		...(canonical ? { alternates: { canonical } } : {}),
		...(noIndex ? { robots: { index: false, follow: false } } : {}),
		openGraph,
		twitter: {
			card: twitterCardImage ? "summary_large_image" : "summary",
			title: socialTitle,
			...(cardDescription ? { description: cardDescription } : {}),
			...(twitterImages ? { images: twitterImages } : {}),
		},
	};
}
