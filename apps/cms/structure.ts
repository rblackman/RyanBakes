import {
	FcAlphabeticalSortingAz,
	FcBookmark,
	FcClock,
	FcDocument,
	FcFolder,
	FcGlobe,
	FcLink,
	FcList,
	FcRuler,
	FcSettings,
	FcShop,
	FcTimeline,
} from "react-icons/fc";
import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { singletons, singletonTypes } from "./singletons";

const apiVersion = "2025-01-01";
const tagsQuery = `array::unique(*[_type == "recipe" && !(_id in path("versions.**"))].tags[])`;

// Types shown in their own section, so the catch-all at the bottom skips them.
const groupedTypes = new Set<string>([...singletonTypes, "recipe", "page", "unit", "navItem"]);

function singletonItem(S: StructureBuilder, type: (typeof singletons)[number]["type"], icon: typeof FcGlobe) {
	const singleton = singletons.find((s) => s.type === type);
	const title = singleton?.title ?? type;
	const id = singleton?.id ?? type;
	return S.listItem().id(id).title(title).icon(icon).child(S.document().title(title).schemaType(type).documentId(id));
}

function recipeList(S: StructureBuilder, title: string, orderBy: { field: string; direction: "asc" | "desc" }) {
	return S.documentTypeList("recipe").title(title).defaultOrdering([orderBy]);
}

export const deskStructure: StructureResolver = (S, context) =>
	S.list()
		.title("Ryan Bakes")
		.items([
			// Recipes first: they are what gets edited most.
			S.listItem()
				.id("recipes")
				.title("Recipes")
				.icon(FcList)
				.child(
					S.list()
						.title("Recipes")
						.items([
							S.listItem()
								.id("all-recipes")
								.title("All recipes")
								.icon(FcAlphabeticalSortingAz)
								.schemaType("recipe")
								.child(recipeList(S, "All recipes", { field: "title", direction: "asc" })),
							S.listItem()
								.id("recently-updated")
								.title("Recently updated")
								.icon(FcClock)
								.schemaType("recipe")
								.child(recipeList(S, "Recently updated", { field: "_updatedAt", direction: "desc" })),
							S.listItem()
								.id("recipes-by-tag")
								.title("Recipes by tag")
								.icon(FcTimeline)
								.child(async () => {
									const tags = await context
										.getClient({ apiVersion })
										.fetch<unknown>(tagsQuery)
										.catch(() => []);
									const tagList = (Array.isArray(tags) ? tags : [])
										.filter((tag): tag is string => typeof tag === "string" && tag.length > 0)
										.sort((a, b) => a.localeCompare(b));

									return S.list()
										.title("Recipes by tag")
										.items(
											tagList.map((tag, index) =>
												S.listItem()
													.id(`tag-${index}`)
													.title(tag)
													.icon(FcBookmark)
													.child(
														S.documentList()
															.title(`Tagged ${tag}`)
															.schemaType("recipe")
															.filter(`_type == "recipe" && $tag in tags`)
															.params({ tag })
															.defaultOrdering([{ field: "title", direction: "asc" }]),
													),
											),
										);
								}),
						]),
				),

			// Pages
			S.listItem()
				.id("pages")
				.title("Pages")
				.icon(FcFolder)
				.child(
					S.list()
						.title("Pages")
						.items([
							singletonItem(S, "recipesPage", FcShop),
							singletonItem(S, "tagsPage", FcBookmark),
							S.divider(),
							S.listItem()
								.id("other-pages")
								.title("Other pages")
								.icon(FcDocument)
								.schemaType("page")
								.child(
									S.documentTypeList("page")
										.title("Pages")
										.defaultOrdering([{ field: "title", direction: "asc" }]),
								),
						]),
				),

			S.divider(),

			// Settings
			S.listItem()
				.id("settings")
				.title("Settings")
				.icon(FcSettings)
				.child(
					S.list()
						.title("Settings")
						.items([
							singletonItem(S, "siteConfig", FcGlobe),
							S.listItem()
								.id("navigation")
								.title("Navigation")
								.icon(FcLink)
								.schemaType("navItem")
								.child(S.documentTypeList("navItem").title("Navigation items")),
							S.listItem()
								.id("units")
								.title("Units of measure")
								.icon(FcRuler)
								.schemaType("unit")
								.child(
									S.documentTypeList("unit")
										.title("Units of measure")
										.defaultOrdering([{ field: "name", direction: "asc" }]),
								),
						]),
				),

			// Any type added later shows up here until it gets a home above.
			...S.documentTypeListItems().filter((listItem) => !groupedTypes.has(listItem.getId() ?? "")),
		]);
