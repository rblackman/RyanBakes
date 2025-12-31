// Provide client-side env vars with zod validation
// Only NEXT_PUBLIC_* vars here

import type { z } from "zod";
import { ClientEnvSchema } from "./env.schema";

export const clientEnv = ClientEnvSchema.parse(process.env);

export type ClientEnv = z.infer<typeof ClientEnvSchema>;
