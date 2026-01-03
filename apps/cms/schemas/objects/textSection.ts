import blockToString from "@helpers/blockToString";
import { FcTemplate } from "react-icons/fc";
import { defineField, defineType } from "sanity";

export default defineType({
	name: "textSection",
	title: "Text",
	type: "object",
	fields: [
		defineField({
			name: "text",
			title: "Text",
			type: "portableText",
			validation: (Rule) => Rule.required(),
		}),
	],
	preview: {
		select: { text: "text" },
		prepare({ text }) {
			const subtitle = Array.isArray(text) ? blockToString(text) : "";
			return { title: "Text Section", subtitle, media: FcTemplate };
		},
	},
});
