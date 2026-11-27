// commitlint config for the PR title check (.github/workflows/pr-title.yml).
// Same rules as the repo config, but without commitlint's default ignores, which
// skip titles such as "2.0.0", "Merge ..." or "Revert ..." without checking them.
// Squash merges use the PR title as the commit message, so every title must pass.
import config from "../commitlint.config.mjs";

export default {
	...config,
	defaultIgnores: false,
};
