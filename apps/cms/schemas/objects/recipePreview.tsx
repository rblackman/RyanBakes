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
			description: "Show this recipe as a large card with its intro text.",
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
	preview: {
		select: { title: "recipe.title", media: "recipe.picture", large: "large" },
		prepare({ title, media, large }) {
			return { title: title ?? "No recipe picked", subtitle: large ? "Recipe card, large" : "Recipe card", media };
		},
	},
});
