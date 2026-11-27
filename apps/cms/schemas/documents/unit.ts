import { FcRuler } from "react-icons/fc";
import { defineField, defineType } from "sanity";
import { warnOnDuplicateUnit } from "../../helpers/validation";

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
			description: "Full name, e.g. Tablespoon.",
			validation: (Rule) => [Rule.required(), Rule.custom(warnOnDuplicateUnit).warning()],
		}),
		defineField({
			name: "abbreviation",
			title: "Abbreviation",
			type: "string",
			description: "Short form shown next to the amount, e.g. Tbsp or g.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "system",
			title: "Measurement System",
			type: "string",
			options: { list: ["Imperial", "Metric"], layout: "radio", direction: "horizontal" },
			initialValue: "Metric",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "type",
			title: "Unit Type",
			type: "string",
			options: { list: ["Volume", "Weight"], layout: "radio", direction: "horizontal" },
			initialValue: "Weight",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "display",
			title: "Display",
			type: "string",
			description: "Fraction shows 0.25 as 1/4 (cups, spoons). Decimal shows the amount as written (grams).",
			options: { list: ["Fraction", "Decimal"], layout: "radio", direction: "horizontal" },
			initialValue: "Decimal",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "noUnit",
			title: "No Unit",
			type: "boolean",
			description: "Hide the unit on the recipe page, e.g. for 2 eggs.",
			initialValue: false,
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "noCount",
			title: "No Count",
			type: "boolean",
			description: "Hide the amount too, e.g. for salt to taste.",
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
		prepare({ name, type, system, display, noUnit, noCount, abbreviation }) {
			const shown = noUnit ? (noCount ? "Hides amount and unit" : "Hides unit") : abbreviation;
			const subtitle = [shown, type, system, display].filter(Boolean).join(" · ");
			return { title: name, subtitle, media: FcRuler };
		},
	},
});
