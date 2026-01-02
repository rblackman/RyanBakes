import { defineField, defineType } from "sanity";

export default defineType({
	name: "inlineImage",
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
		defineField({
			name: "size",
			title: "Size",
			type: "string",
			options: {
				list: ["Small", "Medium", "Full"],
			},
			initialValue: "Medium",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "position",
			title: "Position",
			type: "string",
			options: {
				list: ["Left", "Right", "Block"],
			},
			initialValue: "Block",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "aspectRatio",
			title: "Aspect Ratio",
			type: "string",
			description: "Format should be w/h (e.g. 16/9)",
			validation: (Rule) =>
				Rule.custom((val) => {
					if (!val || (typeof val === "string" && val.length === 0)) return true;
					if (typeof val !== "string") return 'Please use the format "width/height"';
					return /^[0-9]+\/[0-9]+$/.test(val) ? true : 'Please use the format "width/height"';
				}),
		}),
	],
	preview: {
		select: { alt: "alt", media: "asset" },
		prepare({ alt, media }) {
			return { title: "Image", subtitle: alt, media };
		},
	},
});
