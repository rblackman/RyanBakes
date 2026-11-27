import { FcList } from "react-icons/fc";
import { defineArrayMember, defineField, defineType } from "sanity";
import { warnOnPlaceholderText } from "../../helpers/validation";

export default defineType({
	name: "recipe",
	title: "Recipe",
	type: "document",
	icon: FcList,
	fieldsets: [
		{ title: "Recipe Metadata", name: "metadata" },
		{ title: "SEO", name: "seo" },
	],
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: { source: "title", maxLength: 96 },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "picture",
			title: "Picture",
			type: "imageWithAlt",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "commentary",
			title: "Commentary",
			type: "portableText",
			description: "Commentary about this recipe to display at the top of the page.",
			validation: (Rule) => [Rule.required(), Rule.custom(warnOnPlaceholderText).warning()],
		}),
		defineField({
			name: "preheat",
			title: "Preheat",
			type: "number",
			description: "Oven preheat temperature in °F. Leave empty if the recipe does not use the oven.",
			fieldset: "metadata",
		}),
		defineField({
			name: "bakeTime",
			title: "Bake Time",
			type: "number",
			description: "Cook time in minutes (time under heat).",
			fieldset: "metadata",
		}),
		defineField({
			name: "totalTime",
			title: "Total Time",
			type: "number",
			description: "Total time from start to finish in minutes, including rests and rises.",
			fieldset: "metadata",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "serves",
			title: "Serves",
			type: "string",
			description: "Number of servings, e.g. 4 or a range like 2-4.",
			fieldset: "metadata",
		}),
		defineField({
			name: "ingredients",
			title: "Ingredients",
			type: "array",
			of: [defineArrayMember({ type: "ingredient" })],
		}),
		defineField({
			name: "steps",
			title: "Steps",
			type: "array",
			of: [defineArrayMember({ type: "step" })],
		}),
		defineField({
			name: "tags",
			title: "Tags",
			type: "array",
			description:
				"Lowercase words that group this recipe, e.g. pizza or weeknight. Each tag gets a page at /tags/<tag>, so reuse existing tags where they fit.",
			of: [defineArrayMember({ type: "string" })],
			options: { layout: "tags" },
			validation: (Rule) => Rule.unique().required(),
		}),
		defineField({
			name: "showBakerPercentage",
			title: "Show Baker's Percentage",
			type: "boolean",
			description: "Whether to show the baker's percentage table for this recipe.",
			initialValue: false,
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "openGraphImage",
			title: "Open Graph Image",
			type: "imageWithAlt",
			description: "Image to be shown on social media.",
			fieldset: "seo",
			options: { hotspot: true },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "ogDescription",
			title: "Open Graph Description",
			type: "text",
			description:
				"Page description to show when shared on social media. 110-300 characters depending on where it is being shared.",
			fieldset: "seo",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "text",
			description: "Short summary for search engines, about 150 to 200 characters.",
			fieldset: "seo",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "disallowRobots",
			title: "Disallow in robots.txt",
			type: "boolean",
			description: "Ask search engines not to index this recipe.",
			initialValue: false,
			fieldset: "seo",
		}),
	],
	preview: {
		select: {
			title: "title",
			media: "picture",
			slug: "slug.current",
		},
		prepare({ title, media, slug }) {
			const s = slug === "/" ? "/" : `/${slug}`;
			return { title: `${title} (${s})`, media };
		},
	},
});
