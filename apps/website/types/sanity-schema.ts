import type {
	SanityBlock,
	SanityDocument,
	SanityImageAsset,
	SanityImageCrop,
	SanityImageHotspot,
	SanityKeyed,
	SanityKeyedReference,
	SanityReference
} from 'sanity-codegen';

export type { SanityBlock, SanityDocument, SanityImageAsset, SanityImageCrop, SanityImageHotspot, SanityKeyed, SanityKeyedReference, SanityReference };

/**
 * Recipe
 *
 *
 */
export interface Recipe extends SanityDocument {
	_type: 'recipe';

	/**
	 * Title — `string`
	 *
	 *
	 */
	title: string;

	/**
	 * Slug — `slug`
	 *
	 *
	 */
	slug: { _type: 'slug'; current: string };

	/**
	 * Picture — `imageWithAlt`
	 *
	 *
	 */
	picture: ImageWithAlt;

	/**
	 * Commentary — `portableText`
	 *
	 * Commentary about this recipe to display at the top of the page.
	 */
	commentary: PortableText;

	/**
	 * Preheat — `number`
	 *
	 * Oven preheat temperature in fahrenheit
	 */
	preheat?: number;

	/**
	 * Bake Time — `number`
	 *
	 * Cook time in minutes (i.e. Time under heat)
	 */
	bakeTime?: number;

	/**
	 * Total Time — `number`
	 *
	 * Total time (start to finish) in minutes
	 */
	totalTime: number;

	/**
	 * Serves — `string`
	 *
	 * Input in format N-N (e.g. 2-4)
	 */
	serves?: string;

	/**
	 * Ingredients — `array`
	 *
	 *
	 */
	ingredients?: Array<SanityKeyed<Ingredient>>;

	/**
	 * Steps — `array`
	 *
	 *
	 */
	steps?: Array<SanityKeyed<Step>>;

	/**
	 * Tags — `array`
	 *
	 * Tags this recipe falls under.
	 */
	tags: Array<SanityKeyed<string>>;

	/**
	 * Open Graph Image — `imageWithAlt`
	 *
	 * Image to be shown on social media.
	 */
	openGraphImage: ImageWithAlt;

	/**
	 * Open Graph Description — `text`
	 *
	 * Page description to show when shared on social media. 110-300 characters depending on where it is being shared.
	 */
	ogDescription: string;

	/**
	 * description — `text`
	 *
	 * HTML description. Should be ~200 characters.
	 */
	description: string;

	/**
	 * Disallow in robots.txt — `boolean`
	 *
	 * Hide this route for search engines
	 */
	disallowRobots?: boolean;
}

/**
 * Site Configuration
 *
 * Configure global site settings.
 */
export interface SiteConfig extends SanityDocument {
	_type: 'siteConfig';

	/**
	 * Site Title — `string`
	 *
	 *
	 */
	title: string;

	/**
	 * URL — `url`
	 *
	 * The main site URL. Used to create canonical url.
	 */
	url: string;

	/**
	 * Site Language — `string`
	 *
	 *
	 */
	lang: string;

	/**
	 * Main Nav — `array`
	 *
	 *
	 */
	mainNav: Array<SanityKeyedReference<NavItem>>;

	/**
	 * Homepage — `reference`
	 *
	 *
	 */
	homepage: SanityReference<Page>;
}

/**
 * Unit
 *
 *
 */
export interface Unit extends SanityDocument {
	_type: 'unit';

	/**
	 * Name — `string`
	 *
	 * Unit long name.
	 */
	name: string;

	/**
	 * Abbreviation — `string`
	 *
	 * Unit abbreviation
	 */
	abbreviation: string;

	/**
	 * Measurement System — `string`
	 *
	 *
	 */
	system: 'Imperial' | 'Metric';

	/**
	 * Unit Type — `string`
	 *
	 *
	 */
	type: 'Volume' | 'Weight';

	/**
	 * Display — `string`
	 *
	 *
	 */
	display: 'Fraction' | 'Decimal';

	/**
	 * No Unit — `boolean`
	 *
	 * Do not show unit.
	 */
	noUnit: boolean;

	/**
	 * No Count — `boolean`
	 *
	 * Do not show count.
	 */
	noCount: boolean;
}

/**
 * Tags Page
 *
 *
 */
export interface TagsPage extends SanityDocument {
	_type: 'tagsPage';

	/**
	 * Title — `string`
	 *
	 * Title of the page.
	 */
	title: string;

	/**
	 * Intro — `portableText`
	 *
	 * Intro text to show before featured tags
	 */
	intro: PortableText;

	/**
	 * Featured Tag — `string`
	 *
	 * The main tag to feature.
	 */
	featuredTag: string;

	/**
	 * Secondary Featured Tags — `array`
	 *
	 * Other tags to feature.
	 */
	secondaryFeature: Array<SanityKeyed<string>>;
}

/**
 * Recipes Page
 *
 *
 */
export interface RecipesPage extends SanityDocument {
	_type: 'recipesPage';

	/**
	 * Title — `string`
	 *
	 * Title of the page.
	 */
	title: string;

	/**
	 * Intro — `portableText`
	 *
	 * Intro text to show before featured recipes
	 */
	intro: PortableText;

	/**
	 * Featured Tag — `reference`
	 *
	 * The main recipe to feature.
	 */
	featuredRecipe: SanityReference<Recipe>;

	/**
	 * Secondary Featured Recipes — `array`
	 *
	 * Other recipes to feature.
	 */
	secondaryFeatured: Array<SanityKeyedReference<Recipe>>;
}

/**
 * Page
 *
 *
 */
export interface Page extends SanityDocument {
	_type: 'page';

	/**
	 * Title — `string`
	 *
	 * Title of the page.
	 */
	title: string;

	/**
	 * Slug — `slug`
	 *
	 * Page slug
	 */
	slug: { _type: 'slug'; current: string };

	/**
	 * Content — `array`
	 *
	 *
	 */
	content: Array<SanityKeyed<InlineImage> | SanityKeyed<TextSection> | SanityKeyed<RecipePreview>>;
}

/**
 * Navigation Item
 *
 *
 */
export interface NavItem extends SanityDocument {
	_type: 'navItem';

	/**
	 * Name — `string`
	 *
	 * Name to show in the navigation menu.
	 */
	name: string;

	/**
	 * Page — `reference`
	 *
	 *
	 */
	page: SanityReference<Page | TagsPage | RecipesPage>;
}

export type ExternalLink = {
	_type: 'externalLink';
	/**
	 * URL — `url`
	 *
	 *
	 */
	href?: string;
};

export type PortableText = Array<SanityKeyed<SanityBlock>>;

export type SimplePortableText = Array<SanityKeyed<SanityBlock>>;

export type ImageWithAlt = {
	_type: 'imageWithAlt';
	asset: SanityReference<SanityImageAsset>;
	crop?: SanityImageCrop;
	hotspot?: SanityImageHotspot;

	/**
	 * Alt Text — `string`
	 *
	 *
	 */
	alt?: string;

	/**
	 * Empty Alt — `boolean`
	 *
	 *
	 */
	emptyAlt?: boolean;
};

export type Ingredient = {
	_type: 'ingredient';
	/**
	 * Name — `string`
	 *
	 *
	 */
	name: string;

	/**
	 * Amount — `string`
	 *
	 *
	 */
	amount: string;

	/**
	 * Unit — `reference`
	 *
	 *
	 */
	unit: SanityReference<Unit>;

	/**
	 * Notes — `string`
	 *
	 *
	 */
	notes?: string;

	/**
	 * Used In Steps — `array`
	 *
	 *
	 */
	usedInSteps?: Array<SanityKeyed<number>>;
};

export type RecipePreview = {
	_type: 'recipePreview';
	/**
	 * Large — `boolean`
	 *
	 *
	 */
	large: boolean;

	/**
	 * Recipe — `reference`
	 *
	 *
	 */
	recipe: SanityReference<Recipe>;
};

export type InlineImage = {
	_type: 'inlineImage';
	asset: SanityReference<SanityImageAsset>;
	crop?: SanityImageCrop;
	hotspot?: SanityImageHotspot;

	/**
	 * Alt Text — `string`
	 *
	 *
	 */
	alt?: string;

	/**
	 * Empty Alt — `boolean`
	 *
	 *
	 */
	emptyAlt?: boolean;

	/**
	 * Size — `string`
	 *
	 *
	 */
	size?: 'Small' | 'Medium' | 'Full';

	/**
	 * Position — `string`
	 *
	 *
	 */
	position: 'Left' | 'Right' | 'Block';

	/**
	 * Aspect Ratio — `string`
	 *
	 * Format should be w/h (e.g. 16/9)
	 */
	aspectRatio?: string;
};

export type Step = {
	_type: 'step';
	/**
	 * Title — `string`
	 *
	 *
	 */
	title: string;

	/**
	 * Content — `array`
	 *
	 *
	 */
	content: Array<SanityKeyed<InlineImage> | SanityKeyed<TextSection>>;
};

export type TextSection = {
	_type: 'textSection';
	/**
	 * Text — `portableText`
	 *
	 *
	 */
	text: PortableText;
};

export type Documents = Recipe | SiteConfig | Unit | TagsPage | RecipesPage | Page | NavItem;
