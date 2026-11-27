import { FcSettings } from "react-icons/fc";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
	name: "siteConfig",
	title: "Site Configuration",
	type: "document",
	description: "Configure global site settings.",
	icon: FcSettings,
	fields: [
		defineField({
			name: "title",
			title: "Site Title",
			type: "string",
			description: "Shown in the header on every page and at the start of browser tab titles.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "tagline",
			title: "Tagline",
			type: "string",
			description: 'Short headline at the top of the homepage, e.g. "Recipes from Ryan\'s kitchen".',
			validation: (Rule) => Rule.max(80).warning("Keep the tagline short so it fits on one line."),
		}),
		defineField({
			name: "description",
			title: "Site Description",
			type: "text",
			rows: 3,
			description:
				"One or two sentences about the site. Shown under the tagline on the homepage and used as the default description for search engines and social sharing.",
			validation: (Rule) =>
				Rule.max(200).warning("Search engines usually cut descriptions off after about 160 characters."),
		}),
		defineField({
			name: "url",
			title: "URL",
			type: "url",
			description: "The main site URL, e.g. https://ryan-bakes.com. Used to build canonical URLs.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "lang",
			title: "Site Language",
			type: "string",
			description: "Language code for the <html lang> attribute, e.g. en-us.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "mainNav",
			title: "Main Nav",
			type: "array",
			description: "Navigation items shown in the header, in this order.",
			of: [defineArrayMember({ type: "reference", to: [{ type: "navItem" }] })],
			validation: (Rule) => Rule.required().min(1),
		}),
		defineField({
			name: "homepage",
			title: "Homepage",
			type: "reference",
			description: "The page whose content blocks appear below the tagline on the homepage.",
			to: [{ type: "page" }],
			validation: (Rule) => Rule.required(),
		}),
	],
});
