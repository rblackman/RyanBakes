import { flag } from "flags/next";

export const darkModeOverride = flag({
	key: "dark-mode-override",
	description: "Enable dark mode override",
	decide() {
		return false;
	},
});
