import { flag } from "flags/next";

const origin = process.env.FLAGS_ORIGIN;

export const darkModeOverride = flag<boolean>({
	key: "dark-mode-override",
	decide: () => false,
	description: "Override to enable dark mode for all users",
	...(origin ? { origin } : {}),
});
