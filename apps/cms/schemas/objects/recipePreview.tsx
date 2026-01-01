import { defineField, defineType } from "sanity";

export default defineType({
	name: "recipePreview",
	title: "Recipe Preview",
	type: "object",
	fields: [
		defineField({
			name: "large",
			title: "Large",
			type: "boolean",
			initialValue: false,
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "recipe",
			title: "Recipe",
			type: "reference",
			to: [{ type: "recipe" }],
			validation: (Rule) => Rule.required(),
		}),
	],
});
