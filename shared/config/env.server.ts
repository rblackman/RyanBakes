// Provide server-side environment variables with build-time validation
import "server-only";
import type { z } from "zod";
import { ServerEnvSchema } from "./env.schema";

export const serverEnv = ServerEnvSchema.parse(process.env);

export type ServerEnv = z.infer<typeof ServerEnvSchema>;
