import { FcBookmark } from "react-icons/fc";
import { defineArrayMember, defineField, defineType } from "sanity";
import { warnOnPlaceholderText, warnOnUnusedTag } from "../../helpers/validation";

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
			description: "Intro text shown at the top of the tags page, above the featured tags.",
			validation: (Rule) => [Rule.required(), Rule.custom(warnOnPlaceholderText).warning()],
		}),
		defineField({
			name: "featuredTag",
			title: "Featured Tag",
			type: "string",
			description:
				"The tag shown first in the featured section. Must match a tag used on at least one recipe, e.g. pizza.",
			validation: (Rule) => [Rule.required(), Rule.custom(warnOnUnusedTag).warning()],
		}),
		defineField({
			name: "secondaryFeature",
			title: "Secondary Featured Tags",
			type: "array",
			description: "Two to six more tags shown in the featured section. Each must match a recipe tag.",
			of: [
				defineArrayMember({
					type: "string",
					validation: (Rule) => Rule.custom(warnOnUnusedTag).warning(),
				}),
			],
			options: { layout: "tags" },
			validation: (Rule) => Rule.unique().required().min(2).max(6),
		}),
	],
});
