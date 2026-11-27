/**
 * The schema.org shapes this site emits as JSON-LD. These describe the output for search engines,
 * not Sanity content, so they are written by hand. Only the properties the site fills in are listed.
 * See https://developers.google.com/search/docs/appearance/structured-data/recipe
 */

export type JsonLdPerson = {
	"@type": "Person";
	name: string;
	url?: string;
};

export type JsonLdHowToStep = {
	"@type": "HowToStep";
	name?: string;
	text: string;
	url?: string;
	image?: string;
};

export type JsonLdRecipe = {
	"@context": "https://schema.org";
	"@type": "Recipe";
	"@id"?: string;
	name: string;
	url?: string;
	mainEntityOfPage?: string;
	image?: string[];
	description?: string;
	author?: JsonLdPerson;
	datePublished?: string;
	dateModified?: string;
	prepTime?: string;
	cookTime?: string;
	totalTime?: string;
	recipeYield?: string[];
	keywords?: string;
	recipeIngredient?: string[];
	recipeInstructions?: JsonLdHowToStep[];
};

export type JsonLdListItem = {
	"@type": "ListItem";
	position: number;
	name: string;
	item?: string;
};

export type JsonLdBreadcrumbList = {
	"@context": "https://schema.org";
	"@type": "BreadcrumbList";
	itemListElement: JsonLdListItem[];
};

export type JsonLdWebSite = {
	"@context": "https://schema.org";
	"@type": "WebSite";
	"@id"?: string;
	name: string;
	url: string;
	description?: string;
	inLanguage?: string;
	alternateName?: string;
};

export type JsonLd = JsonLdRecipe | JsonLdBreadcrumbList | JsonLdWebSite;
