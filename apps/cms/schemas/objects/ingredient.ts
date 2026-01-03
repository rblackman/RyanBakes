import { FcCheckmark } from "react-icons/fc";
import { defineArrayMember, defineField, defineType } from "sanity";
import AutoFillGramsInput from "../components/autofill-grams-input";

const GRAMS_UNIT_ID =
	(process.env.SANITY_STUDIO_GRAMS_UNIT_ID as string) ??
	(() => {
		throw new Error("Missing SANITY_STUDIO_GRAMS_UNIT_ID");
	})();

type IngredientForValidation = {
	bakers?: { includeInBakersMath?: boolean };
};

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
			validation: (Rule) =>
				Rule.required().custom((value, context) => {
					const parent = context.parent as IngredientForValidation;
					const include = parent?.bakers?.includeInBakersMath === true;

					if (!include) {
						return true;
					}

					const ref = (value as { _ref?: string } | undefined)?._ref;
					if (!ref) {
						return "Unit reference is required.";
					}

					if (ref !== GRAMS_UNIT_ID) {
						return "Unit must be grams when included in baker math.";
					}

					return true;
				}),
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
		defineField({
			name: "bakers",
			title: "Baker Math",
			type: "object",
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
			amount: "amount",
			unit: "unit.abbreviation",
			steps: "usedInSteps",
			include: "bakers.includeInBakersMath",
			grams: "bakers.grams",
			isFlour: "bakers.isFlour",
			hyd: "bakers.countsTowardHydration",
			factor: "bakers.hydrationFactor",
		},
		prepare({ name, amount, unit, steps, include, grams, isFlour, hyd, factor }) {
			const s = Array.isArray(steps) ? steps : [];
			const base =
				s.length > 0
					? `${amount}${unit ?? ""} (Step${s.length > 1 ? "s" : ""}: ${s.join(", ")})`
					: `${amount}${unit ?? ""} (Not Associated with Step)`;

			if (!include || !grams) {
				return { title: name, subtitle: base, media: FcCheckmark };
			}

			const flags: string[] = [];
			if (isFlour) {
				flags.push("flour");
			}
			if (hyd) {
				flags.push(`hydration${factor !== undefined && factor !== 1 ? ` x${factor}` : ""}`);
			}

			return {
				title: name,
				subtitle: `${base} • ${grams}g${flags.length > 0 ? ` (${flags.join(", ")})` : ""}`,
				media: FcCheckmark,
			};
		},
	},
});
