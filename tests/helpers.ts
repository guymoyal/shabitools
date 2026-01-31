/**
 * Helper functions for Playwright tests
 */

export async function waitForToolToLoad(page: any, timeout = 10000) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Extra wait for React hydration
}

export async function checkForErrors(page: any) {
  const errors: string[] = [];
  
  page.on('console', (msg: any) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', (error: Error) => {
    errors.push(error.message);
  });
  
  return errors;
}

export async function takeScreenshot(page: any, name: string) {
  await page.screenshot({
    path: `tests/screenshots/${name}.png`,
    fullPage: true,
  });
}

export async function testDarkMode(page: any) {
  const darkModeToggle = page.locator(
    'button[aria-label*="theme"], button[aria-label*="dark"], button[aria-label*="light"]'
  ).first();
  
  if (await darkModeToggle.count() > 0) {
    const initialClass = await page.locator('html').getAttribute('class');
    await darkModeToggle.click();
    await page.waitForTimeout(500);
    const afterToggleClass = await page.locator('html').getAttribute('class');
    
    return {
      toggleExists: true,
      toggled: initialClass !== afterToggleClass,
    };
  }
  
  return {
    toggleExists: false,
    toggled: false,
  };
}

export async function testMobileView(page: any) {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(500);
  
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const viewportWidth = page.viewportSize()?.width || 375;
  
  return {
    bodyWidth,
    viewportWidth,
    fits: bodyWidth <= viewportWidth + 20,
  };
}
