import { test, expect } from '@playwright/test';

test('homepage loads with logo and coming soon message', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('img[alt="shabitools"]')).toBeVisible();
  await expect(page.getByRole('heading', { name: /home & power tools reviews/i })).toBeVisible();
  await expect(page.getByText('Coming soon')).toBeVisible();
});
