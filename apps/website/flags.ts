import { flag } from "flags/next";

export const darkModeOverride = flag<boolean>({
	key: "dark-mode-override",
	defaultValue: false,
	options: [
		{ label: "Off", value: false },
		{ label: "On", value: true },
	],
	decide: () => {
		return false;
	},
	description: "Override to enable dark mode for all users",
});
