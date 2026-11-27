import { FcViewDetails } from "react-icons/fc";
import { defineField, defineType } from "sanity";

export default defineType({
	name: "navItem",
	title: "Navigation Item",
	type: "document",
	icon: FcViewDetails,
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			description: "Name to show in the navigation menu.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "page",
			title: "Page",
			type: "reference",
			description: "The page this menu item links to.",
			to: [{ type: "page" }, { type: "tagsPage" }, { type: "recipesPage" }],
			validation: (Rule) => Rule.required(),
		}),
	],
	preview: {
		select: { title: "name", pageTitle: "page.title", slug: "page.slug.current" },
		prepare({ title, pageTitle, slug }) {
			const target = slug ? `/${slug}` : pageTitle;
			return { title: title ?? "Untitled item", subtitle: target ? `Links to ${target}` : "No page picked" };
		},
	},
});
