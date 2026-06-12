import { expect, test } from '@playwright/test';

test('homepage renders hero, nav, and review cards', async ({ page }) => {
  // Force desktop viewport so the main nav (hidden md:flex) is visible in all browser projects
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/power tool/i);
  await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
  await expect(page.locator('a[href^="/reviews/"]').first()).toBeVisible();
});

test('review page has verdict, pros/cons, FAQ, and JSON-LD', async ({ page }) => {
  await page.goto('/reviews/makita-xfd131');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Makita');
  await expect(page.getByText('Our verdict')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Pros' })).toBeVisible();
  await expect(page.getByText('Frequently asked questions')).toBeVisible();
  expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(0);
});

test('guide page renders ranked picks', async ({ page }) => {
  await page.goto('/guides/best-cordless-drill-2026');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/best cordless drill/i);
  // Scope to the award-label badge span to avoid matching the review section h2
  await expect(
    page.locator('span').filter({ hasText: /^Best overall$/ }).first()
  ).toBeVisible();
});

test('no tracker URLs in rendered HTML', async ({ page }) => {
  for (const path of ['/', '/reviews/makita-xfd131', '/stores']) {
    await page.goto(path);
    expect(await page.content()).not.toContain('tatrck.com');
  }
});
