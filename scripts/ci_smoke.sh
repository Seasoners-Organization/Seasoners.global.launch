#!/usr/bin/env bash
# CI-friendly smoke test for local dev server.
# Assumptions:
# - Dev server is running at http://localhost:3000 with NODE_ENV=development
# - `node` and `curl` are available
# - This script uses dev-only endpoints added to the app for testing
set -euo pipefail

BASE=http://localhost:3000
TEST_EMAIL=test+ci@example.com

echo "1) Check server reachable"
if ! curl -sI "$BASE/" | head -n1 | grep -E "HTTP/1.[01] (200|302|301)" >/dev/null; then
  echo "Server not reachable at $BASE - start the dev server and ensure NODE_ENV=development" >&2
  exit 2
fi

echo "2) Create test listing via Prisma helper script"
node scripts/create_test_listing.js > /tmp/ci_listing.json
# Extract the last non-empty line (the script prints logs to stderr) and parse JSON from it
LISTING_ID=$(tail -n1 /tmp/ci_listing.json | jq -r '.listingId')
USER_ID=$(tail -n1 /tmp/ci_listing.json | jq -r '.userId')
if [ -z "$LISTING_ID" ] || [ "$LISTING_ID" = "null" ]; then
  echo "Failed to create listing. See /tmp/ci_listing.json" >&2
  cat /tmp/ci_listing.json
  exit 3
fi

echo "Created listing: $LISTING_ID (user: $USER_ID)"

# Wait a moment for DB to be consistent
sleep 0.5

echo "3) Emulate guest creating a request via dev endpoint"
GUEST_EMAIL=$TEST_EMAIL
RESP=$(curl -s -o /tmp/ci_guest_resp.json -w "%{http_code}" -X POST "$BASE/api/dev/agreements/request" \
  -H 'Content-Type: application/json' \
  -d '{"email":"'$TEST_EMAIL'","listingId":"'$LISTING_ID'","preamble":"CI smoke preamble","clauses":[{"title":"A","content":"B"}]}' )

if [ "$RESP" -ne 201 ]; then
  echo "Guest request failed with HTTP $RESP" >&2
  echo "Response:" && cat /tmp/ci_guest_resp.json
  exit 4
fi

echo "Guest request created (201)."

echo "4) Emulate host creating an agreement via dev endpoint (should be allowed for listing owner)"
RESP2=$(curl -s -o /tmp/ci_host_resp.json -w "%{http_code}" -X POST "$BASE/api/dev/agreements/create" \
  -H 'Content-Type: application/json' \
  -d '{"email":"test+autotest1@example.com","listingId":"'$LISTING_ID'","preamble":"Host preamble","clauses":[{"title":"H","content":"Host clause"}]}' )

if [ "$RESP2" -ne 201 ]; then
  echo "Host create failed with HTTP $RESP2" >&2
  echo "Response:" && cat /tmp/ci_host_resp.json
  exit 5
fi

echo "Host create returned 201."

echo "5) Verify agreements exist for listing via Prisma helper"
node scripts/query_agreements.js "$LISTING_ID"

echo "CI smoke flow completed successfully."
