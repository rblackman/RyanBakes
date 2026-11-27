"use server";

import { revalidateTag, updateTag } from "next/cache";
import { draftMode } from "next/headers";
import { parseTags } from "next-sanity/live";

/**
 * Handles live content events from `<SanityLive />`.
 *
 * next-sanity 13 changed the default so published changes only show up after a visitor
 * refreshes or navigates. This restores the next-sanity 12 behavior: visitors who are not in
 * draft mode see a published change within a few seconds, and draft mode (Presentation tool)
 * revalidates with the "max" profile and refreshes the router.
 * See next-sanity's MIGRATE-v12-to-v13.md, "Restore the previous default behavior".
 */
export async function handleLiveEvent(unsafeTags: unknown): Promise<"refresh" | undefined> {
	const { isEnabled: isDraftMode } = await draftMode();
	const { tags } = parseTags(unsafeTags);

	for (const tag of tags) {
		if (isDraftMode) {
			revalidateTag(tag, "max");
		} else {
			updateTag(tag);
		}
	}

	return isDraftMode ? "refresh" : undefined;
}
