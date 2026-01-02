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
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "url",
			title: "URL",
			type: "url",
			description: "The main site URL. Used to create canonical url.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "lang",
			title: "Site Language",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "mainNav",
			title: "Main Nav",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: [{ type: "navItem" }] })],
			validation: (Rule) => Rule.required().min(1),
		}),
		defineField({
			name: "homepage",
			title: "Homepage",
			type: "reference",
			to: [{ type: "page" }],
			validation: (Rule) => Rule.required(),
		}),
	],
});
