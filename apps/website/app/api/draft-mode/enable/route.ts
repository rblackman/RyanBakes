import { serverEnv } from "@shared/config/env.server";
import { sanityClient } from "@shared/lib/sanity";
import { defineEnableDraftMode } from "next-sanity/draft-mode";

const token = serverEnv.SANITY_VIEWER_TOKEN;

export const { GET } = defineEnableDraftMode({
	client: sanityClient.withConfig({
		token,
	}),
});
