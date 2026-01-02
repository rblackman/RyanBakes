import { defineArrayMember, defineType } from "sanity";

export default defineType({
	name: "simplePortableText",
	title: "Simple Portable Text",
	type: "array",
	of: [
		defineArrayMember({
			type: "block",
			styles: [],
			lists: [],
			marks: {
				decorators: [
					{ title: "Strong", value: "strong" },
					{ title: "Emphasis", value: "em" },
					{ title: "Code", value: "code" },
					{ title: "Fraction", value: "fraction" },
				],
				annotations: [{ type: "internalLink" }, { type: "externalLink" }],
			},
		}),
	],
	validation: (Rule) => Rule.required(),
});
