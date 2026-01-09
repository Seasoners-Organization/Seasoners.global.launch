#!/usr/bin/env bash
set -euo pipefail

BASE_URL=${BASE_URL:-"https://www.seasoners.eu"}

echo "Running smoke checks against ${BASE_URL}"

failures=0

check_url() {
  local url="$1"
  local expect_text="${2:-}"
  local code
  code=$(curl -sS -o /dev/null -w "%{http_code}" "$url") || true
  echo "${code} ${url}"
  if [[ "$code" != "200" ]]; then
    echo "  ✗ Expected 200, got ${code}"
    failures=$((failures+1))
    return
  fi
  if [[ -n "$expect_text" ]]; then
    if curl -sSL "$url" | grep -i -m1 -q "$expect_text"; then
      echo "  ✓ Found: ${expect_text}"
    else
      echo "  ✗ Missing expected text: ${expect_text}"
      failures=$((failures+1))
    fi
  fi
}

check_url "${BASE_URL}/" "Seasoners"
check_url "${BASE_URL}/destinations/winter" "Winter Destinations"
check_url "${BASE_URL}/destinations/summer" "Summer Destinations"
check_url "${BASE_URL}/destinations/all"

# Optional deep links (best-effort)
check_url "${BASE_URL}/zones/alps-winter"
check_url "${BASE_URL}/zones/australian-summer"

if [[ "$failures" -gt 0 ]]; then
  echo "Smoke checks failed: ${failures} issue(s)"
  exit 1
fi

echo "All smoke checks passed."
