import { FcViewDetails } from "react-icons/fc";
import { defineField, defineType } from "sanity";

export default defineType({
	name: "navItem",
	title: "Navigation Item",
	type: "document",
	icon: FcViewDetails,
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			description: "Name to show in the navigation menu.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "page",
			title: "Page",
			type: "reference",
			to: [{ type: "page" }, { type: "tagsPage" }, { type: "recipesPage" }],
			validation: (Rule) => Rule.required(),
		}),
	],
});
