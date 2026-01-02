import { defineField, defineType } from "sanity";

export default defineType({
	name: "imageWithAlt",
	title: "Image",
	type: "image",
	options: { hotspot: true },
	fields: [
		defineField({
			name: "alt",
			title: "Alt Text",
			type: "string",
			validation: (Rule) =>
				Rule.custom((alt, ctx) => {
					const parent = ctx.parent as { emptyAlt?: boolean } | undefined;
					if (typeof alt === "string" && alt.length > 0) return true;
					if (parent?.emptyAlt === true) return true;
					return "Must provide alt text.";
				}),
		}),
		defineField({
			name: "emptyAlt",
			title: "Empty Alt",
			type: "boolean",
			initialValue: false,
		}),
	],
	preview: {
		select: { subtitle: "alt", media: "image" },
		prepare({ subtitle, media }) {
			return { title: "Image", subtitle, media };
		},
	},
});
