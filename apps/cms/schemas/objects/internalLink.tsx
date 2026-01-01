import { FcLink } from "react-icons/fc";
import { defineField, defineType } from "sanity";

export default defineType({
	name: "internalLink",
	title: "Internal link",
	type: "object",
	icon: FcLink,
	fields: [
		defineField({
			name: "reference",
			title: "Document",
			type: "reference",
			to: [{ type: "page" }, { type: "recipe" }, { type: "tagsPage" }, { type: "recipesPage" }],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "anchor",
			title: "Anchor (optional)",
			type: "string",
			description: 'Optional. Example: "ingredients" (without #)',
		}),
	],
});
