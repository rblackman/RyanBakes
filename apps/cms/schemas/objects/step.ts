import { blocksToString } from "@helpers/blockToString";
import { FcCheckmark } from "react-icons/fc";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
	name: "step",
	title: "Step",
	type: "object",
	icon: FcCheckmark,
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "content",
			title: "Content",
			type: "array",
			of: [defineArrayMember({ type: "inlineImage" }), defineArrayMember({ type: "textSection" })],
			validation: (Rule) => Rule.required().min(1),
		}),
	],
	preview: {
		select: { title: "title", sections: "content" },
		prepare({ title, sections }) {
			const sectionArray = Array.isArray(sections) ? sections : [];
			const textSections = sectionArray.filter((s) => s?._type === "textSection");
			const imageSections = sectionArray.filter((s) => s?._type === "inlineImage");

			const subtitle = textSections.length > 0 ? blocksToString(textSections) : "";
			const media = imageSections.length > 0 ? imageSections[0]?.asset : undefined;

			return { title, subtitle, media, icon: FcCheckmark };
		},
	},
});
