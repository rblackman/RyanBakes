import { FcDocument } from "react-icons/fc";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
	name: "page",
	title: "Page",
	type: "document",
	icon: FcDocument,
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			description: "Title of the page.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "title",
				maxLength: 96,
			},
			description: "The URL path for this page, e.g. about for /about.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "content",
			title: "Content",
			type: "array",
			description: "Text, images and recipe cards, shown in this order.",
			of: [
				defineArrayMember({ type: "inlineImage" }),
				defineArrayMember({ type: "textSection" }),
				defineArrayMember({ type: "recipePreview" }),
			],
			validation: (Rule) => Rule.required(),
		}),
	],
});
