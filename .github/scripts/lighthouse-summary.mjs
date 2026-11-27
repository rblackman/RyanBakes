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

const rows = representative.map((entry) => {
	const report = JSON.parse(readFileSync(entry.jsonPath, "utf8"));
	const page = new URL(entry.url).pathname;
	const { summary } = entry;
	return `| \`${page}\` | ${score(summary.performance)} | ${score(summary.accessibility)} | ${score(summary["best-practices"])} | ${score(summary.seo)} | ${metric(report, "largest-contentful-paint")} | ${metric(report, "total-blocking-time")} | ${metric(report, "cumulative-layout-shift")} |`;
});

const markdown = [
	`### ${label}`,
	"",
	"Median of the runs for each page.",
	"",
	"| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |",
	"| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
	...rows,
	"",
].join("\n");

console.log(markdown);

const summaryFile = process.env.GITHUB_STEP_SUMMARY;
if (summaryFile) {
	appendFileSync(summaryFile, `${markdown}\n`);
}
