import { test, expect } from '@playwright/test';

// Verify Flatshares page filters: season updates locations and URL

test.describe('Filters - Flatshares', () => {
  test('flatshares: season filters location options and updates URL', async ({ page }) => {
    await page.goto('/flatshares');

    const seasonSelect = page.locator('select[aria-label="Season"]');
    const locationSelect = page.locator('select[aria-label="Location"]');

    await expect(seasonSelect).toBeVisible();
    await expect(locationSelect).toBeVisible();

    // Select Winter then verify typical winter/summer options
    await seasonSelect.selectOption('winter');
    await expect(locationSelect).toBeVisible();

    await expect(locationSelect).toContainText('Innsbruck'); // winter
    await expect(locationSelect).not.toContainText('Bali'); // summer

    await locationSelect.selectOption({ label: 'Innsbruck' });

    await expect(page).toHaveURL(/flatshares\?(.+&)?season=winter(&|$)/);
    await expect(page).toHaveURL(/flatshares\?(.+&)?(season=winter&)?location=Innsbruck(&|$)/);

    // Switch to Summer and verify options change
    await seasonSelect.selectOption('summer');
    await expect(locationSelect).toContainText('Bali');
  });
});
