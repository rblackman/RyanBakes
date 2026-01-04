import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { serverEnv } from "@shared/config/env.server";
import { revalidateTag } from "next/cache";

type SanityWebhookPayload = {
	_id?: unknown;
	_type?: unknown;
	slug?: unknown;
	tags?: unknown;
};

const revalidationProfile = "max";

function generateRequestId(): string {
	const random = globalThis.crypto?.randomUUID?.();
	if (typeof random === "string" && random.length > 0) {
		return random;
	}

	const ts = Date.now().toString(36);
	const rand = Math.random().toString(36).slice(2, 8);
	return `${ts}-${rand}`;
}

function log(level: "info" | "warn" | "error", message: string, details?: Record<string, unknown>) {
	if (level === "info") {
		console.info(`[revalidate] ${message}`, details);
		return;
	}

	if (level === "warn") {
		console.warn(`[revalidate] ${message}`, details);
		return;
	}

	console.error(`[revalidate] ${message}`, details);
}

export async function POST(req: Request) {
	const reqId = generateRequestId();
	const startTs = Date.now();
	const secret = serverEnv.SANITY_REVALIDATE_SECRET;

	if (!secret || secret.trim().length === 0) {
		log("error", "Missing SANITY_REVALIDATE_SECRET in server env", { reqId });
		return new Response("Server misconfigured", { status: 500 });
	}

	const bodyText = await req.text();

	const signature = req.headers.get(SIGNATURE_HEADER_NAME);

	log("info", "Webhook received", {
		reqId,
		profile: revalidationProfile,
		bodyLength: bodyText.length,
		hasSignatureHeader: Boolean(signature),
	});

	if (!signature) {
		log("warn", "Missing signature header", {
			expectedHeader: SIGNATURE_HEADER_NAME,
			hasAnySanityHeader: Array.from(req.headers.keys()).some(
				(h) => h.startsWith("sanity-") || h.startsWith("x-sanity"),
			),
			reqId,
		});

		return new Response("Missing signature", { status: 401 });
	}

	const signatureIsValid = await isValidSignature(bodyText, signature, secret.trim());

	if (!signatureIsValid) {
		log("warn", "Invalid signature", {
			headerUsed: SIGNATURE_HEADER_NAME,
			bodyLength: bodyText.length,
			reqId,
		});

		return new Response("Invalid signature", { status: 401 });
	}

	// SIGNATURE VALID

	let payload: SanityWebhookPayload;

	try {
		payload = JSON.parse(bodyText) as SanityWebhookPayload;
	} catch {
		log("warn", "Invalid JSON payload", { reqId });
		return new Response("Invalid JSON payload", { status: 400 });
	}

	const payloadType = typeof payload._type === "string" ? payload._type : undefined;
	const payloadId = typeof payload._id === "string" ? payload._id : undefined;
	const payloadSlug = extractSlug(payload.slug);

	log("info", "Parsed payload", {
		reqId,
		docType: payloadType,
		docId: payloadId,
		slug: payloadSlug,
		payload,
	});

	const tags = Array.from(getRevalidationTags(payload));

	if (tags.length === 0) {
		log("info", "No tags to revalidate", { reqId, docType: payloadType, docId: payloadId });
		return new Response(null, { status: 204 });
	}

	log("info", "Computed tags", { reqId, count: tags.length, tags });

	await Promise.all(tags.map((tag) => revalidateTag(tag, revalidationProfile)));

	log("info", "Revalidation complete", { reqId, count: tags.length, tookMs: Date.now() - startTs });

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
