// tests/advisor.spec.ts
import { test, expect } from '@playwright/test';

const fakeAnswer = {
  question: 'a good cordless drill around $150',
  answerHash: 'abc12345',
  intro: 'Here are three solid picks under $150.',
  groups: [{ label: 'Cordless drill', totalEstimate: null, cards: [{
    groupLabel: 'Cordless drill', asin: 'B0TEST1234', title: 'Test Drill 20V',
    imageUrl: null, price: '$129.00', currency: 'USD', rating: null,
    why: 'Best value for occasional DIY.', affiliateUrl: 'https://www.amazon.com/dp/B0TEST1234?tag=shabitools-20',
    internalHref: '/categories/cordless-drills', internalLabel: 'Cordless Drills', position: 0 }] }],
};

test('hero search routes to advisor and renders cards', async ({ page }) => {
  await page.route('**/api/advisor', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fakeAnswer) }));

  await page.goto('/');
  await page.getByPlaceholder(/Ask anything/i).fill('a good cordless drill around $150');
  await page.getByRole('button', { name: /Ask AI/i }).click();

  await expect(page).toHaveURL(/\/advisor\?q=/);
  await expect(page.getByText('Here are three solid picks under $150.')).toBeVisible();
  await expect(page.getByText('Test Drill 20V')).toBeVisible();
  await expect(page.getByRole('link', { name: /View on Amazon/i })).toBeVisible();
});
