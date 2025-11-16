import { test, expect } from '@playwright/test';

// Basic filter behavior test focusing on Stays page UI state
// Verifies that selecting a Season updates the Location options and URL query

test.describe('Filters', () => {
  test('stays: season filters location options and updates URL', async ({ page }) => {
    await page.goto('/stays');

    const seasonSelect = page.locator('select[aria-label="Season"]');
    const locationSelect = page.locator('select[aria-label="Location"]');

    await expect(seasonSelect).toBeVisible();
    await expect(locationSelect).toBeVisible();

    // Select Winter and assert a winter location is present and typical summer one is absent
    await seasonSelect.selectOption('winter');

    // Wait for options to refresh
    await expect(locationSelect).toBeVisible();

    // Check example options
    await expect(locationSelect).toContainText('Innsbruck'); // winter
    await expect(locationSelect).not.toContainText('Bali'); // summer

    // Choose a specific winter location and verify URL query updates
    await locationSelect.selectOption({ label: 'Innsbruck' });

    await expect(page).toHaveURL(/stays\?(.+&)?season=winter(&|$)/);
    await expect(page).toHaveURL(/stays\?(.+&)?(season=winter&)?location=Innsbruck(&|$)/);

    // Switch to Summer and verify options change
    await seasonSelect.selectOption('summer');
    await expect(locationSelect).toContainText('Bali');
  });
});
