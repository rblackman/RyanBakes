// Writes a Markdown table of Lighthouse scores for one form factor to the job summary.
// Usage: node .github/scripts/lighthouse-summary.mjs <reports dir> <label>
// Reads the manifest.json that `lhci upload --target=filesystem` writes.
import { appendFileSync, readFileSync } from "node:fs";
import path from "node:path";

const [reportsDir, label = "Lighthouse"] = process.argv.slice(2);

if (!reportsDir) {
	console.error("Usage: lighthouse-summary.mjs <reports dir> <label>");
	process.exit(1);
}

const manifest = JSON.parse(readFileSync(path.join(reportsDir, "manifest.json"), "utf8"));
const representative = manifest.filter((entry) => entry.isRepresentativeRun);

const score = (value) => (typeof value === "number" ? Math.round(value * 100).toString() : "n/a");

function metric(report, id) {
	const audit = report.audits?.[id];
	if (!audit || typeof audit.displayValue !== "string") {
		return "n/a";
	}
	return audit.displayValue.replace(/ /g, " ");
}

// Categories where any audit below a full score is worth fixing. Performance is left out because
// its opportunities are estimates, not failures.
const checkedCategories = ["accessibility", "best-practices", "seo"];

/** Lists the scored audits that did not pass in the checked categories, as "category: title". */
function failingAudits(report) {
	const failing = [];
	for (const categoryId of checkedCategories) {
		const category = report.categories?.[categoryId];
		if (!category) {
			continue;
		}
		for (const ref of category.auditRefs ?? []) {
			const audit = report.audits?.[ref.id];
			if (ref.weight > 0 && audit && typeof audit.score === "number" && audit.score < 1) {
				failing.push(`${category.title}: ${audit.title}`);
			}
		}
	}
	return failing;
}

/** One line on what the largest contentful paint waited for, from the LCP breakdown insight. */
function lcpBreakdown(report) {
	const details = report.audits?.["lcp-breakdown-insight"]?.details;
	if (details?.type !== "list") {
		return undefined;
	}
	const table = details.items.find((item) => item.type === "table");
	const node = details.items.find((item) => item.type === "node");
	if (!table) {
		return undefined;
	}
	const parts = table.items.map((item) => `${item.label} ${Math.round(item.duration)} ms`).join(", ");
	const element = node?.snippet ? ` on \`${node.snippet.slice(0, 80)}\`` : "";
	return `${parts}${element}`;
}

/** The first few browser console errors, which cost best-practices points. */
function consoleErrors(report) {
	const items = report.audits?.["errors-in-console"]?.details?.items ?? [];
	return items
		.slice(0, 3)
		.map((item) => `${item.source ?? "console"}: ${String(item.description ?? "").slice(0, 160)}`);
}

const rows = [];
const failures = [];
const notes = [];
for (const entry of representative) {
	const report = JSON.parse(readFileSync(entry.jsonPath, "utf8"));
	const page = new URL(entry.url).pathname;
	const { summary } = entry;
	rows.push(
		`| \`${page}\` | ${score(summary.performance)} | ${score(summary.accessibility)} | ${score(summary["best-practices"])} | ${score(summary.seo)} | ${metric(report, "largest-contentful-paint")} | ${metric(report, "total-blocking-time")} | ${metric(report, "cumulative-layout-shift")} |`,
	);
	for (const failure of failingAudits(report)) {
		failures.push(`- \`${page}\`: ${failure}`);
	}
	for (const error of consoleErrors(report)) {
		failures.push(`  - ${error.replace(/\s+/g, " ")}`);
	}
	const breakdown = lcpBreakdown(report);
	if (breakdown) {
		notes.push(`- \`${page}\`: ${breakdown}`);
	}
}

const markdown = [
	`### ${label}`,
	"",
	"Scores from the representative run for each page: the run whose load timings are closest to the median.",
	"",
	"| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |",
	"| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
	...rows,
	"",
	...(failures.length > 0 ? ["Audits that did not pass:", "", ...failures, ""] : []),
	...(notes.length > 0 ? ["Largest contentful paint breakdown:", "", ...notes, ""] : []),
].join("\n");

console.log(markdown);

const summaryFile = process.env.GITHUB_STEP_SUMMARY;
if (summaryFile) {
	appendFileSync(summaryFile, `${markdown}\n`);
}
