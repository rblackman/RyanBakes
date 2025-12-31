import "dotenv/config";
import {
	ClientEnvSchema,
	ServerEnvSchema,
} from "../src/shared/config/env.schema";

// Parse using process.env so it matches Next build environment
ClientEnvSchema.parse(process.env);

ServerEnvSchema.parse(process.env);

console.log("✅ Environment validated");
