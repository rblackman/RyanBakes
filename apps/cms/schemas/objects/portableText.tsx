import { defineArrayMember, defineType } from "sanity";

export default defineType({
	name: "portableText",
	title: "Portable Text",
	type: "array",
	of: [
		defineArrayMember({
			type: "block",
			styles: [
				{ title: "Normal", value: "normal" },
				{ title: "H2", value: "h2" },
				{ title: "H3", value: "h3" },
				{ title: "H4", value: "h4" },
				{ title: "Quote", value: "blockquote" },
			],
			marks: {
				decorators: [
					{ title: "Strong", value: "strong" },
					{ title: "Emphasis", value: "em" },
					{ title: "Fraction", value: "fraction" },
				],
				annotations: [{ type: "externalLink" }, { type: "internalLink" }],
			},
		}),
	],
	validation: (Rule) => Rule.required(),
});
