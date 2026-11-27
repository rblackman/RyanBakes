import { FcList } from "react-icons/fc";
import { defineArrayMember, defineField, defineType } from "sanity";
import { validateServes, warnOnBakeTimeOverTotal, warnOnPlaceholderText } from "../../helpers/validation";

function formatMinutes(minutes: unknown): string | undefined {
	if (typeof minutes !== "number" || minutes <= 0) {
		return undefined;
	}

	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	if (hours === 0) {
		return `${rest} min`;
	}

	return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

export default defineType({
	name: "recipe",
	title: "Recipe",
	type: "document",
	icon: FcList,
	groups: [
		{ name: "recipe", title: "Recipe", default: true },
		{ name: "ingredients", title: "Ingredients" },
		{ name: "steps", title: "Steps" },
		{ name: "seo", title: "Search and sharing" },
	],
	fieldsets: [
		{
			title: "Times and servings",
			name: "metadata",
			description: "Times are in minutes. Leave a field empty to hide it on the recipe page.",
			options: { columns: 2 },
		},
	],
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			group: "recipe",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			description: "The URL of the recipe, /recipe/<slug>. Click Generate to build it from the title.",
			group: "recipe",
			options: { source: "title", maxLength: 96 },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "picture",
			title: "Picture",
			type: "imageWithAlt",
			description: "The main photo, shown at the top of the recipe and on recipe cards.",
			group: "recipe",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "commentary",
			title: "Commentary",
			type: "portableText",
			description: "Commentary about this recipe to display at the top of the page.",
			group: "recipe",
			validation: (Rule) => [Rule.required(), Rule.custom(warnOnPlaceholderText).warning()],
		}),
		defineField({
			name: "preheat",
			title: "Preheat (°F)",
			type: "number",
			description: "Oven temperature. Leave empty if the recipe does not use the oven.",
			group: "recipe",
			fieldset: "metadata",
			validation: (Rule) => Rule.min(150).max(800).warning("That looks like an unusual oven temperature. Is it in °F?"),
		}),
		defineField({
			name: "bakeTime",
			title: "Bake Time",
			type: "number",
			description: "Minutes under heat.",
			group: "recipe",
			fieldset: "metadata",
			validation: (Rule) => [
				Rule.min(1).integer().warning("Use whole minutes."),
				Rule.custom(warnOnBakeTimeOverTotal).warning(),
			],
		}),
		defineField({
			name: "totalTime",
			title: "Total Time",
			type: "number",
			description: "Minutes from start to finish, including rests and rises.",
			group: "recipe",
			fieldset: "metadata",
			validation: (Rule) => [Rule.required(), Rule.min(1).integer().warning("Use whole minutes.")],
		}),
		defineField({
			name: "serves",
			title: "Serves",
			type: "string",
			description: "A number such as 4, or a range such as 4-6.",
			group: "recipe",
			fieldset: "metadata",
			validation: (Rule) => Rule.custom(validateServes).warning(),
		}),
		defineField({
			name: "tags",
			title: "Tags",
			type: "array",
			description:
				"Lowercase words that group this recipe, e.g. pizza or weeknight. Each tag gets a page at /tags/<tag>, so reuse existing tags where they fit (see Recipes by tag in the sidebar).",
			group: "recipe",
			of: [defineArrayMember({ type: "string" })],
			options: { layout: "tags" },
			validation: (Rule) => Rule.unique().required(),
		}),
		defineField({
			name: "ingredients",
			title: "Ingredients",
			type: "array",
			description: "In the order they are used. Tick the steps each one belongs to.",
			group: "ingredients",
			of: [defineArrayMember({ type: "ingredient" })],
			validation: (Rule) => Rule.min(1).warning("Add at least one ingredient."),
		}),
		defineField({
			name: "showBakerPercentage",
			title: "Show Baker's Percentage",
			type: "boolean",
			description: "Show the baker's percentage table. Fill in Baker Math on each ingredient that counts toward it.",
			group: "ingredients",
			initialValue: false,
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "steps",
			title: "Steps",
			type: "array",
			description:
				"Ingredients are matched to steps by position. If you reorder, add or remove steps, check Used In Steps on the ingredients.",
			group: "steps",
			of: [defineArrayMember({ type: "step" })],
			validation: (Rule) => Rule.min(1).warning("Add at least one step."),
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "text",
			rows: 3,
			description:
				"Short summary for search engines, about 150 characters. Also used for social sharing unless you fill in the sharing description below.",
			group: "seo",
			validation: (Rule) => [
				Rule.required(),
				Rule.max(200).warning("Search engines usually cut descriptions off after about 160 characters."),
			],
		}),
		defineField({
			name: "ogDescription",
			title: "Sharing Description",
			type: "text",
			rows: 3,
			description:
				"Optional. Shown when the recipe is shared on social media. Leave empty to use the description above.",
			group: "seo",
			validation: (Rule) => Rule.max(300).warning("Most sites cut sharing text off after about 300 characters."),
		}),
		defineField({
			name: "openGraphImage",
			title: "Sharing Image",
			type: "imageWithAlt",
			description:
				"Optional. Shown when the recipe is shared on social media, cropped to about 1200 x 627. Leave empty to use the main picture.",
			group: "seo",
			options: { hotspot: true },
		}),
		defineField({
			name: "disallowRobots",
			title: "Hide from search engines",
			type: "boolean",
			description: "Ask search engines not to index this recipe.",
			group: "seo",
			initialValue: false,
		}),
	],
	orderings: [
		{ title: "Title", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
		{ title: "Recently updated", name: "updatedDesc", by: [{ field: "_updatedAt", direction: "desc" }] },
		{ title: "Quickest first", name: "totalTimeAsc", by: [{ field: "totalTime", direction: "asc" }] },
	],
	preview: {
		select: {
			title: "title",
			media: "picture",
			totalTime: "totalTime",
			tags: "tags",
		},
		prepare({ title, media, totalTime, tags }) {
			const tagText = Array.isArray(tags) && tags.length > 0 ? tags.join(", ") : undefined;
			const subtitle = [formatMinutes(totalTime), tagText].filter(Boolean).join(" · ");
			return { title: title ?? "Untitled recipe", subtitle, media };
		},
	},
});
