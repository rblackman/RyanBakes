import { FcRuler } from "react-icons/fc";
import { defineField, defineType } from "sanity";

export default defineType({
	name: "unit",
	title: "Unit",
	type: "document",
	icon: FcRuler,
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			description: "Unit long name.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "abbreviation",
			title: "Abbreviation",
			type: "string",
			description: "Unit abbreviation",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "system",
			title: "Measurement System",
			type: "string",
			options: { list: ["Imperial", "Metric"] },
			initialValue: "Metric",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "type",
			title: "Unit Type",
			type: "string",
			options: { list: ["Volume", "Weight"] },
			initialValue: "Weight",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "display",
			title: "Display",
			type: "string",
			options: { list: ["Fraction", "Decimal"] },
			initialValue: "Decimal",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "noUnit",
			title: "No Unit",
			type: "boolean",
			description: "Do not show unit.",
			initialValue: false,
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "noCount",
			title: "No Count",
			type: "boolean",
			description: "Do not show count.",
			initialValue: false,
			validation: (Rule) => Rule.required(),
		}),
	],
	orderings: [{ title: "Name", name: "name", by: [{ field: "name", direction: "asc" }] }],
	preview: {
		select: {
			name: "name",
			type: "type",
			system: "system",
			display: "display",
			noUnit: "noUnit",
			noCount: "noCount",
			abbreviation: "abbreviation",
		},
		prepare({ name, type, system, display, noUnit }) {
			const subtitle = noUnit ? "" : `${type} / ${system} / ${display}`;
			return { title: name, subtitle, media: FcRuler, icon: FcRuler };
		},
	},
});
