// Provide client-side env vars with zod validation
// Only NEXT_PUBLIC_* vars here

import type { z } from "zod";
import { ClientEnvSchema } from "./env.schema";

const rawClientEnv = {
	NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
	NEXT_PUBLIC_SANITY_KEY: process.env.NEXT_PUBLIC_SANITY_KEY,
	NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
	NEXT_PUBLIC_SANITY_STUDIO_URL: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
} as const;

export const clientEnv = ClientEnvSchema.parse(rawClientEnv);

export type ClientEnv = z.infer<typeof ClientEnvSchema>;
