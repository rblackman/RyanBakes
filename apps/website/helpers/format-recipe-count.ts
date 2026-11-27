export default function formatRecipeCount(count: number): string {
	return `${count} ${count === 1 ? "recipe" : "recipes"}`;
}
