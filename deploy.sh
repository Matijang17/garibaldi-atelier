#!/usr/bin/env bash
set -euo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a git repository."
  exit 1
fi

if [[ $# -gt 0 ]]; then
  commit_msg="$*"
else
  commit_msg="Update site $(date '+%Y-%m-%d %H:%M')"
fi

if [[ -z "$(git status --porcelain)" ]]; then
  echo "No changes to commit."
  exit 0
fi

git add -A
git commit -m "$commit_msg"
git push origin main
