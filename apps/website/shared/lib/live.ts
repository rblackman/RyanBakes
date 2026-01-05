import { defineLive } from "next-sanity/live";
import "server-only";
import { serverEnv } from "../config/env.server";
import { sanityClient } from "./sanity";

const token = serverEnv.SANITY_VIEWER_TOKEN;

const { sanityFetch, SanityLive } = defineLive({
	client: sanityClient,
	serverToken: token,
	browserToken: token,
});

export { SanityLive, sanityFetch };
