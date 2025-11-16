#!/usr/bin/env bash
# Quick smoke tests for local dev server (assumes dev server running on localhost:3000)
set -euo pipefail

echo "=== Root status ==="
curl -sI http://localhost:3000/ | head -n1 || true

echo "\n=== Zone page (alps-winter) head ==="
curl -sI http://localhost:3000/zones/alps-winter | head -n10 || true

echo "\n=== Listings (region/type filters) ==="
curl -s 'http://localhost:3000/api/listings' | jq -r '.listings | length, .listings[0] // "(none)"' || true

echo "\n=== Guest agreement request (requires auth) ==="
echo "This endpoint requires an authenticated session. To test, sign in via the app UI or adjust the script to include a valid cookie/Authorization header."

echo "\nSmoke tests finished."
