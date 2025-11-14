import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';

test('CI smoke: guest request and host create flows (dev endpoints)', async ({ request }) => {
  // Create a test listing using the repo helper script. The script prints a JSON
  // object on the last line containing listingId and userId.
  const out = execSync('node scripts/create_test_listing.js', { encoding: 'utf8' });
  const lines = out.trim().split(/\r?\n/).filter(Boolean);
  const jsonLine = lines.reverse().find(l => l.trim().startsWith('{') && l.trim().endsWith('}'));
  expect(jsonLine, 'create_test_listing.js did not print JSON').toBeTruthy();
  const data = JSON.parse(jsonLine!);
  const listingId = data.listingId;
  expect(listingId).toBeTruthy();

  // Ensure the guest user exists (creates or finds by email)
  const guestCreateOut = execSync('node scripts/create_user_with_email.js test+ci@example.com', { encoding: 'utf8' });
  const guestLines = guestCreateOut.trim().split(/\r?\n/).filter(Boolean);
  const guestJsonLine = guestLines.reverse().find(l => l.trim().startsWith('{') && l.trim().endsWith('}'));
  expect(guestJsonLine, 'create_user_with_email.js did not print JSON').toBeTruthy();
  const guestData = JSON.parse(guestJsonLine!);
  expect(guestData.email).toBe('test+ci@example.com');

  // Emulate guest request via dev-only endpoint — retry if user not yet visible
  let guestResp: any;
  const maxAttempts = 8;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    guestResp = await request.post('/api/dev/agreements/request', {
      data: {
        email: 'test+ci@example.com',
        listingId,
        preamble: 'CI smoke preamble',
        clauses: [{ title: 'A', content: 'First clause' }],
      },
    });

    if (guestResp.status() === 201) break;

    // If user isn't found, wait and retry (exponential backoff)
    const txt = await guestResp.text().catch(() => '');
    if (guestResp.status() === 404 && txt.includes('User not found')) {
      if (attempt === maxAttempts) break;
      await new Promise((r) => setTimeout(r, 250 * attempt));
      continue;
    }

    // Any other unexpected status — fail fast with a helpful message
    expect(guestResp.status(), `guest request should return 201 (got ${guestResp.status()})`).toBe(201);
  }

  expect(guestResp.status(), 'guest request should return 201').toBe(201);
  const guestJson = await guestResp.json();
  expect(guestJson).toHaveProperty('id');
  expect(guestJson.status).toBe('PENDING_HOST');

  // Emulate host creating an agreement via dev-only endpoint
  const hostResp = await request.post('/api/dev/agreements/create', {
    data: {
      email: 'test+autotest1@example.com',
      listingId,
      preamble: 'Host preamble',
      clauses: [{ title: 'H', content: 'Host clause' }],
    },
  });
  expect(hostResp.status(), 'host create should return 201').toBe(201);
  const hostJson = await hostResp.json();
  expect(hostJson).toHaveProperty('id');
  // Host-created agreements are created as DRAFT in the dev endpoint
  expect(hostJson.status).toBe('DRAFT');
});
