import { FcBookmark } from "react-icons/fc";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
	name: "tagsPage",
	title: "Tags Page",
	type: "document",
	icon: FcBookmark,
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			description: "Title of the page.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "intro",
			title: "Intro",
			type: "portableText",
			description: "Intro text to show before featured tags",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "featuredTag",
			title: "Featured Tag",
			type: "string",
			description: "The main tag to feature.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "secondaryFeature",
			title: "Secondary Featured Tags",
			type: "array",
			description: "Other tags to feature.",
			of: [defineArrayMember({ type: "string" })],
			options: { layout: "tags" },
			validation: (Rule) => Rule.unique().required().min(2).max(6),
		}),
	],
});
