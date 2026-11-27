import { FcShop } from "react-icons/fc";
import { defineArrayMember, defineField, defineType } from "sanity";
import { warnOnPlaceholderText } from "../../helpers/validation";

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
			description: "Intro text shown above the featured recipes.",
			validation: (Rule) => [Rule.required(), Rule.custom(warnOnPlaceholderText).warning()],
		}),
		defineField({
			name: "featuredRecipe",
			title: "Featured Recipe",
			type: "reference",
			description: "The recipe shown large at the top of the page.",
			to: [{ type: "recipe" }],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "secondaryFeatured",
			title: "Secondary Featured Recipes",
			type: "array",
			description: "Two to six more recipes shown below the featured recipe.",
			of: [defineArrayMember({ type: "reference", to: [{ type: "recipe" }] })],
			validation: (Rule) => Rule.unique().required().min(2).max(6),
		}),
	],
});
