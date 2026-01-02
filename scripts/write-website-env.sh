#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/apps/website/.env"

if [ -f "${ENV_FILE}" ]; then
	echo "apps/website/.env already exists; skipping generation."
	exit 0
fi

REQUIRED_VARS=(
	"NEXT_PUBLIC_BASE_URL"
	"NEXT_PUBLIC_SANITY_DATASET"
	"NEXT_PUBLIC_SANITY_KEY"
	"RECIPES_PAGE_KEY"
	"SITE_CONFIG_KEY"
	"TAGS_PAGE_KEY"
)

missing_vars=()
for var in "${REQUIRED_VARS[@]}"; do
	if [ -z "${!var:-}" ]; then
		missing_vars+=("${var}")
	fi
done

if [ "${#missing_vars[@]}" -gt 0 ]; then
	echo "Skipping apps/website/.env creation because the following variables are missing:"
	for var in "${missing_vars[@]}"; do
		echo "- ${var}"
	done

	echo "Set them as Codespaces secrets (or export them locally) before running this script."
	exit 0
fi

cat > "${ENV_FILE}" <<EOF
NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
NEXT_PUBLIC_SANITY_DATASET=${NEXT_PUBLIC_SANITY_DATASET}
NEXT_PUBLIC_SANITY_KEY=${NEXT_PUBLIC_SANITY_KEY}
RECIPES_PAGE_KEY=${RECIPES_PAGE_KEY}
SITE_CONFIG_KEY=${SITE_CONFIG_KEY}
TAGS_PAGE_KEY=${TAGS_PAGE_KEY}
EOF

echo "Wrote ${ENV_FILE}"
