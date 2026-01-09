import { flag } from "flags/next";

export const darkModeOverride = flag<boolean>({
	key: "dark-mode-override",
	decide: () => false,
	description: "Override to enable dark mode for all users",
});
