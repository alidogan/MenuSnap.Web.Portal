#!/usr/bin/env bash
# Playwright requires Node.js (not Bun) for its test runner.
# We use the absolute Homebrew node path to avoid Bun's PATH interception.
REAL_NODE="$(brew --prefix)/bin/node"

if [ ! -x "$REAL_NODE" ]; then
  echo "Error: Node.js is required to run Playwright tests. Install it via: brew install node" >&2
  exit 1
fi

exec "$REAL_NODE" "$(dirname "$0")/../node_modules/@playwright/test/cli.js" test -c playwright.config.ts "$@"
