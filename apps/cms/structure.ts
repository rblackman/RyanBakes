import { FcBookmark, FcDocument, FcFolder, FcGlobe, FcLink, FcList, FcRuler, FcSettings, FcShop } from "react-icons/fc";
import type { StructureResolver } from "sanity/structure";

export const deskStructure: StructureResolver = (S) =>
	S.list()
		.title("Ryan Bakes")
		.items([
			// Settings
			S.listItem()
				.title("Settings")
				.icon(FcSettings)
				.child(
					S.list()
						.title("Items")
						.items([
							S.listItem()
								.title("Global Settings")
								.icon(FcGlobe)
								.child(S.document().schemaType("siteConfig").documentId("siteConfig")),
							S.listItem().title("Measurements").icon(FcRuler).child(S.documentTypeList("unit").title("All Units")),
							S.listItem().title("Nav Items").icon(FcLink).child(S.documentTypeList("navItem").title("All Nav Items")),
						]),
				),

			// Recipes
			S.listItem()
				.title("Recipes")
				.icon(FcList)
				.child(S.documentTypeList("recipe").title("Recipes")),

			// Pages
			S.listItem()
				.title("Pages")
				.icon(FcFolder)
				.child(
					S.list()
						.title("Page Types")
						.items([
							S.listItem()
								.title("Tags Page")
								.icon(FcBookmark)
								.child(S.document().title("Tags Page").schemaType("tagsPage").documentId("tagsPage")),
							S.listItem()
								.title("Recipes Page")
								.icon(FcShop)
								.child(S.document().title("Recipes Page").schemaType("recipesPage").documentId("recipesPage")),
							S.listItem().title("Pages").icon(FcDocument).child(S.documentTypeList("page")),
						]),
				),

			// Everything else (like your defaultItems filter)
			...S.documentTypeListItems().filter(
				(listItem) =>
					!["tagsPage", "recipesPage", "recipe", "unit", "siteConfig", "page", "navItem"].includes(
						listItem.getId() ?? "",
					),
			),
		]);
