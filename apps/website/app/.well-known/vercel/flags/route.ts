import { createFlagsDiscoveryEndpoint, getProviderData, type KeyedFlagDefinitionType } from "flags/next";
import * as flags from "../../../../flags";

export const GET = createFlagsDiscoveryEndpoint(() => {
	const f = flags as Record<string, KeyedFlagDefinitionType | readonly unknown[]>;
	return getProviderData(f);
});
