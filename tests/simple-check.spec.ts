import { test, expect } from '@playwright/test';

// Simple test - just check if pages load
const tools = [
  '/tools/json-formatter',
  '/tools/regex-tester',
  '/tools/base64-encoder',
  '/tools/api-tester',
  '/tools/visual-diff',
  '/tools/page-speed-compare',
  '/tools/markdown-editor',
  '/tools/code-formatter',
  '/tools/css-minifier',
  '/tools/yaml-formatter',
  '/tools/email-validator',
  '/tools/jwt-decoder',
  '/tools/ip-address-info',
  '/tools/json-to-csv',
  '/tools/csv-to-json',
  '/tools/json-diff',
  '/tools/text-diff',
  '/tools/url-parser',
  '/tools/uuid-generator',
  '/tools/html-encoder',
  '/tools/timestamp-converter',
  '/tools/image-converter',
  '/tools/color-contrast-checker',
  '/tools/color-palette-generator',
  '/tools/qr-generator',
  '/tools/password-generator',
  '/tools/text-counter',
  '/tools/lorem-ipsum',
];

test.describe('Simple Page Load Check', () => {
  for (const path of tools) {
    test(`Page loads: ${path}`, async ({ page }) => {
      // Check HTTP status code
      const response = await page.goto(path, { waitUntil: 'networkidle' });
      
      // Verify status is 200 (not 404)
      if (response) {
        expect(response.status()).toBe(200);
      }
      
      await page.waitForTimeout(1000);
      
      // Check URL contains the path
      expect(page.url()).toContain(path);
      
      // Check page has content
      const bodyText = await page.textContent('body') || '';
      expect(bodyText.length).toBeGreaterThan(100);
      
      // Check for 404 page indicators (more specific)
      const lowerText = bodyText.toLowerCase();
      const is404Page = lowerText.includes('404') && 
                       (lowerText.includes('not found') || 
                        lowerText.includes('page not found') ||
                        lowerText.includes('this page could not be found'));
      
      expect(is404Page).toBeFalsy();
      
      // Check for main content (heading or main element)
      const hasContent = await page.locator('h1, h2, main, [role="main"]').count() > 0;
      expect(hasContent).toBeTruthy();
    });
  }
});

test('Homepage loads', async ({ page }) => {
  const response = await page.goto('/', { waitUntil: 'networkidle' });
  if (response) {
    expect(response.status()).toBe(200);
  }
  await page.waitForTimeout(1000);
  const bodyText = await page.textContent('body') || '';
  expect(bodyText.length).toBeGreaterThan(100);
  
  // Check for main heading
  const heading = await page.locator('h1, h2').first();
  expect(await heading.isVisible()).toBeTruthy();
});

test('Tools page loads', async ({ page }) => {
  const response = await page.goto('/tools', { waitUntil: 'networkidle' });
  if (response) {
    expect(response.status()).toBe(200);
  }
  await page.waitForTimeout(1000);
  const bodyText = await page.textContent('body') || '';
  expect(bodyText.length).toBeGreaterThan(100);
  
  // Check for tool links
  const toolLinks = await page.locator('a[href*="/tools/"]').count();
  expect(toolLinks).toBeGreaterThan(0);
});
