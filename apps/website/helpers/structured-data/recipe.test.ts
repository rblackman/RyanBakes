import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Recipe, Unit } from "@ryan-bakes/sanity-types";
import buildBreadcrumbJsonLd from "./breadcrumbs";
import minutesToIsoDuration from "./duration";
import buildRecipeJsonLd, { formatIngredient, formatYield, type ImageUrlBuilder } from "./recipe";
import serializeJsonLd from "./serialize";
import type { JsonLdRecipe } from "./types";
import buildWebSiteJsonLd from "./website";

const url = "https://ryan-bakes.com/recipe/detroit-pizza";

const imageUrl: ImageUrlBuilder = (image, width, height) =>
	`https://cdn.example/${image.asset?._ref ?? "none"}?w=${width}&h=${height}`;

function unit(overrides: Partial<Unit> & Pick<Unit, "_id">): Unit {
	return {
		_type: "unit",
		_createdAt: "2024-01-01T00:00:00Z",
		_updatedAt: "2024-01-01T00:00:00Z",
		_rev: "r",
		...overrides,
	};
}

const units: Unit[] = [
	unit({ _id: "gram", name: "Gram", abbreviation: "g", display: "Decimal", noUnit: false, noCount: false }),
	unit({ _id: "cup", name: "Cup", abbreviation: "cup", display: "Fraction" }),
	unit({ _id: "taste", name: "No Unit or Count", abbreviation: "N/A", noUnit: true, noCount: true }),
	unit({ _id: "each", name: "No Unit", abbreviation: "N/A", noUnit: true, noCount: false }),
];

function block(text: string, key: string) {
	return {
		_type: "block" as const,
		_key: key,
		style: "normal" as const,
		markDefs: [],
		children: [{ _type: "span" as const, _key: `${key}s`, text, marks: [] }],
	};
}

const fullRecipe: Recipe = {
	_id: "recipe-1",
	_type: "recipe",
	_createdAt: "2024-03-01T12:00:00Z",
	_updatedAt: "2026-11-20T08:30:00Z",
	_rev: "r1",
	title: "Detroit Pizza",
	slug: { _type: "slug", current: "detroit-pizza" },
	picture: { _type: "imageWithAlt", asset: { _type: "reference", _ref: "image-abc-1200x800-jpg" }, alt: "Pizza" },
	description: "A thick, crispy-edged pan pizza.",
	bakeTime: 14,
	totalTime: 280,
	serves: "2-4",
	tags: ["pizza", "dough", " favorite "],
	ingredients: [
		{ _key: "i1", _type: "ingredient", name: "Bread Flour", amount: "300", unit: { _type: "reference", _ref: "gram" } },
		{
			_key: "i2",
			_type: "ingredient",
			name: "Milk",
			amount: "1.5",
			notes: "warm",
			unit: { _type: "reference", _ref: "cup" },
		},
		{
			_key: "i3",
			_type: "ingredient",
			name: "Salt & Pepper",
			amount: "0",
			notes: "To Taste",
			unit: { _type: "reference", _ref: "taste" },
		},
		{ _key: "i4", _type: "ingredient", name: "Eggs", amount: "2", unit: { _type: "reference", _ref: "each" } },
		{ _key: "i5", _type: "ingredient", amount: "5", unit: { _type: "reference", _ref: "gram" } },
	],
	steps: [
		{
			_key: "s1",
			_type: "step",
			title: "Mix Dry Ingredients",
			content: [
				{ _key: "t1", _type: "textSection", text: [block("Whisk the flour", "b1"), block("and the salt.", "b2")] },
				{ _key: "im1", _type: "inlineImage", asset: { _type: "reference", _ref: "image-step-800x600-jpg" } },
			],
		},
		{ _key: "s2", _type: "step", title: "Rest", content: [] },
		{ _key: "s3", _type: "step", content: [] },
	],
};

function build(recipe: Recipe): JsonLdRecipe | undefined {
	return buildRecipeJsonLd({ recipe, units, url, author: { "@type": "Person", name: "Ryan Blackman" }, imageUrl });
}

describe("minutesToIsoDuration", () => {
	it("formats minutes, hours and both", () => {
		assert.equal(minutesToIsoDuration(45), "PT45M");
		assert.equal(minutesToIsoDuration(60), "PT1H");
		assert.equal(minutesToIsoDuration(210), "PT3H30M");
		assert.equal(minutesToIsoDuration(1440), "PT24H");
	});

	it("leaves out empty, zero, negative and non-finite values", () => {
		assert.equal(minutesToIsoDuration(undefined), undefined);
		assert.equal(minutesToIsoDuration(null), undefined);
		assert.equal(minutesToIsoDuration(0), undefined);
		assert.equal(minutesToIsoDuration(-5), undefined);
		assert.equal(minutesToIsoDuration(Number.NaN), undefined);
	});
});

describe("formatYield", () => {
	it("puts a bare number first", () => {
		assert.deepEqual(formatYield("4"), ["4", "4 servings"]);
		assert.deepEqual(formatYield("1"), ["1", "1 serving"]);
		assert.deepEqual(formatYield("4-6"), ["4", "4-6 servings"]);
		assert.deepEqual(formatYield("8 – 10"), ["8", "8-10 servings"]);
	});

	it("passes other text through and drops empty values", () => {
		assert.deepEqual(formatYield("one loaf"), ["one loaf"]);
		assert.equal(formatYield(""), undefined);
		assert.equal(formatYield(undefined), undefined);
	});
});

describe("formatIngredient", () => {
	const [flour, milk, salt, eggs, unnamed] = fullRecipe.ingredients ?? [];

	it("joins amount, unit and name like the recipe page", () => {
		assert.equal(flour && formatIngredient(flour, units), "300 g Bread Flour");
	});

	it("shows fractions for Fraction units and adds notes", () => {
		assert.equal(milk && formatIngredient(milk, units), "1 1/2 cup Milk (warm)");
	});

	it("hides the amount and unit for no-count, no-unit ingredients", () => {
		assert.equal(salt && formatIngredient(salt, units), "Salt & Pepper (To Taste)");
		assert.equal(eggs && formatIngredient(eggs, units), "2 Eggs");
	});

	it("skips an ingredient with no name", () => {
		assert.equal(unnamed && formatIngredient(unnamed, units), undefined);
	});

	it("shows the amount alone when the unit can't be resolved", () => {
		assert.equal(
			formatIngredient(
				{ _type: "ingredient", name: "Water", amount: "250", unit: { _type: "reference", _ref: "x" } },
				units,
			),
			"250 Water",
		);
	});
});

describe("buildRecipeJsonLd", () => {
	const jsonLd = build(fullRecipe);

	it("has the required Recipe properties", () => {
		assert.ok(jsonLd);
		assert.equal(jsonLd["@context"], "https://schema.org");
		assert.equal(jsonLd["@type"], "Recipe");
		assert.equal(jsonLd.name, "Detroit Pizza");
		assert.equal(jsonLd.url, url);
		assert.equal(jsonLd.mainEntityOfPage, url);
	});

	it("offers the main picture in 16x9, 4x3 and 1x1", () => {
		assert.deepEqual(jsonLd?.image, [
			"https://cdn.example/image-abc-1200x800-jpg?w=1200&h=675",
			"https://cdn.example/image-abc-1200x800-jpg?w=1200&h=900",
			"https://cdn.example/image-abc-1200x800-jpg?w=1200&h=1200",
		]);
	});

	it("converts times to ISO 8601 durations, with prep as total minus bake", () => {
		assert.equal(jsonLd?.totalTime, "PT4H40M");
		assert.equal(jsonLd?.cookTime, "PT14M");
		assert.equal(jsonLd?.prepTime, "PT4H26M");
	});

	it("maps yield, keywords, dates and author", () => {
		assert.deepEqual(jsonLd?.recipeYield, ["2", "2-4 servings"]);
		assert.equal(jsonLd?.keywords, "pizza, dough, favorite");
		assert.equal(jsonLd?.datePublished, "2024-03-01T12:00:00Z");
		assert.equal(jsonLd?.dateModified, "2026-11-20T08:30:00Z");
		assert.deepEqual(jsonLd?.author, { "@type": "Person", name: "Ryan Blackman" });
		assert.equal(jsonLd?.description, "A thick, crispy-edged pan pizza.");
	});

	it("lists every named ingredient", () => {
		assert.deepEqual(jsonLd?.recipeIngredient, [
			"300 g Bread Flour",
			"1 1/2 cup Milk (warm)",
			"Salt & Pepper (To Taste)",
			"2 Eggs",
		]);
	});

	it("turns steps into HowToSteps with anchors, skipping empty steps", () => {
		assert.deepEqual(jsonLd?.recipeInstructions, [
			{
				"@type": "HowToStep",
				name: "Mix Dry Ingredients",
				text: "Whisk the flour and the salt.",
				url: `${url}#step-1`,
				image: "https://cdn.example/image-step-800x600-jpg?w=1200&h=900",
			},
			{ "@type": "HowToStep", text: "Rest", url: `${url}#step-2` },
		]);
	});

	it("leaves out empty fields instead of sending bad values", () => {
		const minimal = build({
			_id: "r2",
			_type: "recipe",
			_createdAt: "2024-01-01T00:00:00Z",
			_updatedAt: "2024-01-02T00:00:00Z",
			_rev: "r",
			title: "Tea Ring Icing",
			description: "   ",
			totalTime: 5,
			serves: "",
			tags: [],
		});

		assert.ok(minimal);
		for (const key of ["image", "description", "prepTime", "cookTime", "recipeYield", "keywords"] as const) {
			assert.equal(key in minimal, false, `${key} should be left out`);
		}
		assert.equal(minimal.totalTime, "PT5M");
		assert.equal("recipeIngredient" in minimal, false);
		assert.equal("recipeInstructions" in minimal, false);
	});

	it("skips prepTime when the bake time is not shorter than the total", () => {
		const odd = build({ ...fullRecipe, bakeTime: 300, totalTime: 280 });
		assert.equal(odd?.prepTime, undefined);
		assert.equal(odd?.cookTime, "PT5H");
	});

	it("returns undefined without a title", () => {
		assert.equal(build({ ...fullRecipe, title: "  " }), undefined);
	});

	it("never contains undefined, null or empty strings", () => {
		const walk = (value: unknown, path: string): void => {
			assert.notEqual(value, undefined, `${path} is undefined`);
			assert.notEqual(value, null, `${path} is null`);
			if (typeof value === "string") {
				assert.notEqual(value.trim(), "", `${path} is empty`);
			} else if (Array.isArray(value)) {
				assert.ok(value.length > 0, `${path} is an empty array`);
				value.forEach((item, index) => {
					walk(item, `${path}[${index}]`);
				});
			} else if (typeof value === "object") {
				for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
					walk(child, `${path}.${key}`);
				}
			}
		};
		walk(jsonLd, "recipe");
	});
});

describe("buildBreadcrumbJsonLd", () => {
	it("numbers the trail from 1 and keeps urls", () => {
		assert.deepEqual(
			buildBreadcrumbJsonLd([
				{ name: "Home", url: "https://ryan-bakes.com/" },
				{ name: "Recipes", url: "https://ryan-bakes.com/recipe" },
				{ name: "Detroit Pizza", url },
			]),
			{
				"@context": "https://schema.org",
				"@type": "BreadcrumbList",
				itemListElement: [
					{ "@type": "ListItem", position: 1, name: "Home", item: "https://ryan-bakes.com/" },
					{ "@type": "ListItem", position: 2, name: "Recipes", item: "https://ryan-bakes.com/recipe" },
					{ "@type": "ListItem", position: 3, name: "Detroit Pizza", item: url },
				],
			},
		);
	});

	it("drops unnamed crumbs and needs at least two", () => {
		assert.equal(buildBreadcrumbJsonLd([{ name: "Home", url: "https://ryan-bakes.com/" }, { name: " " }]), undefined);
	});
});

describe("buildWebSiteJsonLd", () => {
	it("names the site and its language", () => {
		assert.deepEqual(
			buildWebSiteJsonLd({ name: "Ryan Bakes", url: "https://ryan-bakes.com/", description: "Recipes", lang: "en-us" }),
			{
				"@context": "https://schema.org",
				"@type": "WebSite",
				"@id": "https://ryan-bakes.com/#website",
				name: "Ryan Bakes",
				url: "https://ryan-bakes.com/",
				description: "Recipes",
				inLanguage: "en-us",
			},
		);
	});
});

describe("serializeJsonLd", () => {
	it("escapes < so CMS text can't close the script tag", () => {
		const output = serializeJsonLd({ ...(build(fullRecipe) as JsonLdRecipe), name: "</script><script>alert(1)" });
		assert.equal(output.includes("</script>"), false);
		assert.equal((JSON.parse(output) as JsonLdRecipe).name, "</script><script>alert(1)");
	});
});
