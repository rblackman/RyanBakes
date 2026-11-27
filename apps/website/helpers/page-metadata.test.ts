import assert from "node:assert/strict";
import { describe, it } from "node:test";
import buildPageMetadata from "./page-metadata";

const site = { title: "Ryan Bakes", baseUrl: "https://ryan-bakes.com/", locale: "en_US" };

describe("buildPageMetadata", () => {
	it("sets the canonical URL and full Open Graph and Twitter objects", () => {
		const metadata = buildPageMetadata({ site, title: "Tags", description: "Browse by tag.", path: "/tags" });

		assert.equal(metadata.title, "Tags");
		assert.deepEqual(metadata.alternates, { canonical: "https://ryan-bakes.com/tags" });
		assert.deepEqual(metadata.openGraph, {
			siteName: "Ryan Bakes",
			locale: "en_US",
			title: "Tags",
			description: "Browse by tag.",
			url: "https://ryan-bakes.com/tags",
			type: "website",
		});
		assert.deepEqual(metadata.twitter, { card: "summary", title: "Tags", description: "Browse by tag." });
		assert.equal("robots" in metadata, false);
	});

	it("uses the large Twitter card, article fields and noindex for a hidden recipe", () => {
		const metadata = buildPageMetadata({
			site,
			title: "Detroit Pizza",
			description: "Pan pizza.",
			socialDescription: "Crispy edges.",
			path: "recipe/detroit-pizza",
			type: "article",
			noIndex: true,
			ogImage: { url: "https://cdn.example/og.jpg", width: 1200, height: 630, alt: "Pizza" },
			article: { publishedTime: "2024-01-01", modifiedTime: "2024-02-01", tags: ["pizza"] },
		});

		assert.equal(metadata.description, "Pan pizza.");
		assert.deepEqual(metadata.robots, { index: false, follow: false });
		assert.deepEqual(metadata.alternates, { canonical: "https://ryan-bakes.com/recipe/detroit-pizza" });
		assert.deepEqual(metadata.twitter, {
			card: "summary_large_image",
			title: "Detroit Pizza",
			description: "Crispy edges.",
			images: [{ url: "https://cdn.example/og.jpg", alt: "Pizza" }],
		});
		assert.deepEqual(metadata.openGraph, {
			siteName: "Ryan Bakes",
			locale: "en_US",
			title: "Detroit Pizza",
			description: "Crispy edges.",
			url: "https://ryan-bakes.com/recipe/detroit-pizza",
			images: [{ url: "https://cdn.example/og.jpg", width: 1200, height: 630, alt: "Pizza" }],
			type: "article",
			publishedTime: "2024-01-01",
			modifiedTime: "2024-02-01",
			tags: ["pizza"],
		});
	});

	it("supports an absolute title and leaves out an empty description", () => {
		const metadata = buildPageMetadata({
			site,
			title: "Ryan Bakes | Home",
			absoluteTitle: true,
			description: " ",
			path: "/",
		});
		assert.deepEqual(metadata.title, { absolute: "Ryan Bakes | Home" });
		assert.equal("description" in metadata, false);
	});
});
