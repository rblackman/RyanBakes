import { FcGlobe } from "react-icons/fc";
import { defineField, defineType } from "sanity";

export default defineType({
	name: "externalLink",
	title: "External link",
	type: "object",
	icon: FcGlobe,
	fields: [
		defineField({
			name: "href",
			title: "URL",
			type: "url",
			validation: (Rule) =>
				Rule.uri({
					allowRelative: true,
					scheme: ["http", "https", "mailto", "tel"],
				}),
		}),
	],
});
