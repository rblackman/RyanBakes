import { FcCheckmark } from "react-icons/fc";
import { defineArrayMember, defineField, defineType } from "sanity";
import { validateAmount, validateUsedInSteps, warnOnUnusedIngredient } from "../../helpers/validation";
import AutoFillGramsInput from "../components/autofill-grams-input";
import StepPickerInput from "../components/step-picker-input";

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
			description: "What to add, e.g. bread flour or unsalted butter.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "amount",
			title: "Amount",
			type: "string",
			description:
				"A number (2, 0.25), a fraction (1/2, 1 1/2), a range (2-3) or a word such as Pinch. Units set to show fractions turn decimals like 0.25 into 1/4.",
			validation: (Rule) => [Rule.required(), Rule.custom(validateAmount).warning()],
		}),
		defineField({
			name: "unit",
			title: "Unit",
			type: "reference",
			to: [{ type: "unit" }],
			description: "Pick from the units under Settings. Use No Unit for things counted whole, like eggs.",
			options: { disableNew: true },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "notes",
			title: "Notes",
			type: "string",
			description: "Optional, shown after the name, e.g. softened or divided.",
		}),
		defineField({
			name: "usedInSteps",
			title: "Used In Steps",
			type: "array",
			description: "Tick the steps that use this ingredient. It is listed with those steps on the recipe page.",
			of: [defineArrayMember({ type: "number" })],
			components: { input: StepPickerInput },
			validation: (Rule) => [
				Rule.unique(),
				Rule.custom(validateUsedInSteps),
				Rule.custom(warnOnUnusedIngredient).warning(),
			],
		}),
		defineField({
			name: "bakers",
			title: "Baker Math",
			type: "object",
			description: "Only needed when the recipe shows the baker's percentage table.",
			fields: [
				defineField({
					name: "includeInBakersMath",
					title: "Use in baker math",
					type: "boolean",
					initialValue: false,
				}),
				defineField({
					name: "grams",
					title: "Weight (grams)",
					type: "number",
					components: { input: AutoFillGramsInput },
					description: "Numeric grams used for hydration and baker % calculations.",
					hidden: ({ parent }) => !parent?.includeInBakersMath,
					validation: (Rule) =>
						Rule.custom((value, context) => {
							const parent = context.parent as { includeInBakersMath?: boolean } | undefined;
							if (parent?.includeInBakersMath) {
								if (value === undefined || value === null) {
									return "Weight (grams) is required when using baker math.";
								}
								if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
									return "Weight (grams) must be a number greater than 0.";
								}
							}
							return true;
						}),
				}),
				defineField({
					name: "isFlour",
					title: "Counts as flour",
					type: "boolean",
					initialValue: false,
					description: "Checked ingredients form the denominator for baker % + hydration.",
					hidden: ({ parent }) => !parent?.includeInBakersMath,
				}),
				defineField({
					name: "countsTowardHydration",
					title: "Counts toward hydration (water)",
					type: "boolean",
					initialValue: false,
					description: "Checked ingredients contribute to hydration numerator.",
					hidden: ({ parent }) => !parent?.includeInBakersMath,
				}),
				defineField({
					name: "hydrationFactor",
					title: "Hydration factor (0-1)",
					type: "number",
					initialValue: 1,
					description: "For partial contributors (e.g., eggs/milk). 1 = full weight counts as water.",
					hidden: ({ parent }) => !parent?.includeInBakersMath || !parent?.countsTowardHydration,
					validation: (Rule) =>
						Rule.custom((value, context) => {
							const parent = context.parent as
								| { includeInBakersMath?: boolean; countsTowardHydration?: boolean }
								| undefined;
							if (parent?.includeInBakersMath && parent?.countsTowardHydration) {
								const v = value ?? 1;
								if (typeof v !== "number" || Number.isNaN(v)) {
									return "Hydration factor must be a number.";
								}
								if (v < 0 || v > 1) {
									return "Hydration factor must be between 0 and 1.";
								}
							}
							return true;
						}),
				}),
			],
			options: { collapsible: true, collapsed: true },
		}),
	],
	preview: {
		select: {
			name: "name",
			notes: "notes",
			amount: "amount",
			unit: "unit.abbreviation",
			noUnit: "unit.noUnit",
			noCount: "unit.noCount",
			steps: "usedInSteps",
			include: "bakers.includeInBakersMath",
			grams: "bakers.grams",
			isFlour: "bakers.isFlour",
			hyd: "bakers.countsTowardHydration",
			factor: "bakers.hydrationFactor",
		},
		prepare({ name, notes, amount, unit, noUnit, noCount, steps, include, grams, isFlour, hyd, factor }) {
			const quantity = [noCount ? "" : amount, noUnit ? "" : unit].filter(Boolean).join(" ");
			const s: number[] = Array.isArray(steps) ? steps : [];
			const stepText = s.length > 0 ? `Step${s.length > 1 ? "s" : ""} ${s.join(", ")}` : "No step";

			const parts = [quantity || undefined, stepText];

			if (include && grams) {
				const flags: string[] = [];
				if (isFlour) {
					flags.push("flour");
				}
				if (hyd) {
					flags.push(`hydration${factor !== undefined && factor !== 1 ? ` x${factor}` : ""}`);
				}
				parts.push(`${grams} g${flags.length > 0 ? ` (${flags.join(", ")})` : ""}`);
			}

			return {
				title: notes ? `${name}, ${notes}` : name,
				subtitle: parts.filter(Boolean).join(" · "),
				media: FcCheckmark,
			};
		},
	},
});
