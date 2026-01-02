import { FcShop } from "react-icons/fc";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
	name: "recipesPage",
	title: "Recipes Page",
	type: "document",
	icon: FcShop,
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
			description: "Intro text to show before featured recipes",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "featuredRecipe",
			title: "Featured Tag",
			type: "reference",
			description: "The main recipe to feature.",
			to: [{ type: "recipe" }],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "secondaryFeatured",
			title: "Secondary Featured Recipes",
			type: "array",
			description: "Other recipes to feature.",
			of: [defineArrayMember({ type: "reference", to: [{ type: "recipe" }] })],
			validation: (Rule) => Rule.unique().required().min(2).max(6),
		}),
	],
});
