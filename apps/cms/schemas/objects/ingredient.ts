import { FcCheckmark } from "react-icons/fc";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
	name: "ingredient",
	title: "Ingredient",
	type: "object",
	icon: FcCheckmark,
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "amount",
			title: "Amount",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "unit",
			title: "Unit",
			type: "reference",
			to: [{ type: "unit" }],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "notes",
			title: "Notes",
			type: "string",
		}),
		defineField({
			name: "usedInSteps",
			title: "Used In Steps",
			type: "array",
			of: [defineArrayMember({ type: "number" })],
		}),
	],
	preview: {
		select: {
			name: "name",
			amount: "amount",
			unit: "unit.abbreviation",
			usedInSteps: "usedInSteps",
		},
		prepare({ name, amount, unit, usedInSteps }) {
			const steps = Array.isArray(usedInSteps) ? usedInSteps : [];
			const subtitle =
				steps.length > 0
					? `${amount}${unit ?? ""} (Step${steps.length > 1 ? "s" : ""}: ${steps.join(", ")})`
					: `${amount}${unit ?? ""} (Not Associated with Step)`;
			return { title: name, subtitle, media: FcCheckmark };
		},
	},
});
