import Heading from "app/(components)/heading";
import createImageBuilder from "hooks/useImageBuilder";
import getRecipeBySlug from "queries/getRecipeBySlug";
import type { CSSProperties } from "react";
import "server-only";
import styles from "./(styles)/hero.module.css";
import SubTitle from "./subTitle";

export default async function Hero({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
	const resolvedParams = params instanceof Promise ? await params : params;
	const { slug } = resolvedParams;

	const recipe = await getRecipeBySlug(slug);

	const title = recipe.title ?? "";
	const asset = recipe.picture?.asset;

	if (!asset) {
		return (
			<div className={styles.heroContainer}>
				<div className={styles.headingWrap}>
					<Heading level={2} className={styles.heading ?? ""}>
						{title}
					</Heading>
					<SubTitle params={{ slug }} />
				</div>
			</div>
		);
	}

	const imageBuilder = createImageBuilder(asset);

	const baseUrl = imageBuilder.buildUrlWithOptions({
		crop: "focalpoint",
		quality: 55,
		width: 2000,
		aspectRatio: 7 / 2,
	});
	const baseUrl2x = imageBuilder.buildUrlWithOptions({
		crop: "focalpoint",
		quality: 55,
		width: 2000,
		aspectRatio: 7 / 2,
		dpr: 2,
	});
	const desktop = imageBuilder.buildUrlWithOptions({
		crop: "focalpoint",
		quality: 55,
		width: 1920,
		aspectRatio: 8 / 3,
	});
	const desktop2x = imageBuilder.buildUrlWithOptions({
		crop: "focalpoint",
		quality: 55,
		width: 1920,
		aspectRatio: 8 / 3,
		dpr: 2,
	});
	const tablet = imageBuilder.buildUrlWithOptions({ crop: "focalpoint", quality: 55, width: 1000, aspectRatio: 1 });
	const tablet2x = imageBuilder.buildUrlWithOptions({
		crop: "focalpoint",
		quality: 55,
		width: 1000,
		aspectRatio: 1,
		dpr: 2,
	});
	const mobile = imageBuilder.buildUrlWithOptions({ crop: "focalpoint", quality: 55, width: 768, aspectRatio: 1 });
	const mobile2x = imageBuilder.buildUrlWithOptions({
		crop: "focalpoint",
		quality: 55,
		width: 768,
		aspectRatio: 1,
		dpr: 2,
	});

	const containerStyle = {
		"--bgUrl": `-webkit-image-set(url('${baseUrl}') 1x, url('${baseUrl2x}') 2x)`,
		"--bgUrl-desk": `-webkit-image-set(url('${desktop}') 1x, url('${desktop2x}') 2x)`,
		"--bgUrl-tablet": `-webkit-image-set(url('${tablet}') 1x, url('${tablet2x}') 2x)`,
		"--bgUrl-mobile": `-webkit-image-set(url('${mobile}') 1x, url('${mobile2x}') 2x)`,
	} as CSSProperties;

	return (
		<div className={styles.heroContainer} style={containerStyle}>
			<div className={styles.headingWrap}>
				<Heading level={2} className={styles.heading ?? ""}>
					{title}
				</Heading>
				<SubTitle params={{ slug }} />
			</div>
		</div>
	);
}
