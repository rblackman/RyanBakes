import navItem from "./documents/navItem";
import page from "./documents/page";
import recipe from "./documents/recipe";
import recipesPage from "./documents/recipesPage";
import siteConfig from "./documents/siteConfig";
import tagsPage from "./documents/tagsPage";
import unit from "./documents/unit";

import externalLink from "./objects/externalLink";
import imageWithAlt from "./objects/imageWithAlt";
import ingredient from "./objects/ingredient";
import inlineImage from "./objects/inlineImage";
import internalLink from "./objects/internalLink";
import portableText from "./objects/portableText";
import recipePreview from "./objects/recipePreview";
import simplePortableText from "./objects/simplePortableText";
import step from "./objects/step";
import textSection from "./objects/textSection";

export const schemaTypes = [
	// objects
	externalLink,
	internalLink,
	portableText,
	simplePortableText,
	imageWithAlt,
	ingredient,
	recipePreview,
	inlineImage,
	step,
	textSection,

	// documents
	recipe,
	siteConfig,
	unit,
	tagsPage,
	recipesPage,
	page,
	navItem,
];
