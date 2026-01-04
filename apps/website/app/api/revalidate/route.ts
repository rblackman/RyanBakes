import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { serverEnv } from "@shared/config/env.server";
import { revalidateTag } from "next/cache";

type SanityWebhookPayload = {
	_id?: unknown;
	_type?: unknown;
	slug?: unknown;
	tags?: unknown;
};

const secret = serverEnv.SANITY_REVALIDATE_SECRET;
const revalidationProfile = "max";

export async function POST(req: Request) {
	const signature = req.headers.get(SIGNATURE_HEADER_NAME);
	const bodyText = await req.text();

	if (!signature) {
		return new Response("Missing signature", { status: 401 });
	}

	const signatureIsValid = await isValidSignature(bodyText, signature, secret);

	if (!signatureIsValid) {
		return new Response("Invalid signature", { status: 401 });
	}

	let payload: SanityWebhookPayload;

	try {
		payload = JSON.parse(bodyText) as SanityWebhookPayload;
	} catch {
		return new Response("Invalid JSON payload", { status: 400 });
	}

	const tags = Array.from(getRevalidationTags(payload));

	if (tags.length === 0) {
		return new Response(null, { status: 204 });
	}

	await Promise.all(tags.map((tag) => revalidateTag(tag, revalidationProfile)));

	return new Response(null, { status: 204 });
}

function getRevalidationTags(payload: SanityWebhookPayload): Set<string> {
	const tags = new Set<string>();
	const docType = typeof payload._type === "string" ? payload._type : undefined;
	const docId = typeof payload._id === "string" ? payload._id : undefined;
	const slug = extractSlug(payload.slug);
	const recipeTags = extractStringArray(payload.tags);

	if (!docType) {
		return tags;
	}

	if (docType === "recipe") {
		tags.add("recipe");
		tags.add("recipesPage");
		tags.add("tagsPage");

		if (docId) {
			tags.add(`recipe:${docId}`);
		}

		if (slug) {
			tags.add(`recipe:${slug}`);
		}

		for (const recipeTag of recipeTags) {
			tags.add(`tag:${recipeTag}`);
		}

		return tags;
	}

	if (docType === "navItem") {
		tags.add("navItem");
		return tags;
	}

	if (docType === "page") {
		addPageTags(tags, docId);
		return tags;
	}

	if (docType === "recipesPage") {
		addRecipesPageTags(tags, docId);
		return tags;
	}

	if (docType === "tagsPage") {
		addTagsPageTags(tags, docId);
		return tags;
	}

	if (docType === "siteConfig") {
		addSiteConfigTags(tags, docId);
		return tags;
	}

	if (docType === "unit") {
		tags.add("unit");
		return tags;
	}

	return tags;
}

function addPageTags(tags: Set<string>, docId?: string) {
	tags.add("page");

	if (docId) {
		tags.add(`page:${docId}`);
	}
}

function addRecipesPageTags(tags: Set<string>, docId?: string) {
	tags.add("recipesPage");

	const recipesPageId = docId ?? serverEnv.RECIPES_PAGE_KEY;

	tags.add(`page:${recipesPageId}`);
}

function addTagsPageTags(tags: Set<string>, docId?: string) {
	tags.add("tagsPage");

	const tagsPageId = docId ?? serverEnv.TAGS_PAGE_KEY;

	tags.add(`page:${tagsPageId}`);
}

function addSiteConfigTags(tags: Set<string>, docId?: string) {
	tags.add("siteConfig");

	const siteConfigId = docId ?? serverEnv.SITE_CONFIG_KEY;

	tags.add(`siteConfig:${siteConfigId}`);
}

function extractSlug(slugField: unknown): string | undefined {
	if (typeof slugField === "string" && slugField.length > 0) {
		return slugField;
	}

	if (
		slugField !== null &&
		typeof slugField === "object" &&
		"current" in slugField &&
		typeof (slugField as { current?: unknown }).current === "string"
	) {
		return (slugField as { current: string }).current;
	}

	return undefined;
}

function extractStringArray(value: unknown): string[] {
	if (!Array.isArray(value)) {
		return [];
	}

	return value.filter((item): item is string => typeof item === "string" && item.length > 0);
}
