# Running Playwright Tests

## Quick Start

### Option 1: Run tests with existing dev server (Recommended)

1. **Start your dev server manually** (in a separate terminal):
   ```bash
   pnpm dev
   ```

2. **Run tests** (in another terminal):
   ```bash
   pnpm test
   ```

The config is set to `reuseExistingServer: true`, so it will use your running server.

### Option 2: Let Playwright start the server

If no server is running, Playwright will start it automatically:
```bash
pnpm test
```

## Common Issues

### Port 3000 already in use
**Solution**: Use Option 1 above - start dev server manually, then run tests.

### Tests failing but site works
**Solution**: Tests might be too strict. Check the test output and adjust selectors.

### Dark mode toggle not found
**Solution**: Some pages might not have the toggle in the expected location. Tests will skip if not found.

## Test Commands

```bash
# Run all tests
pnpm test

# Run in UI mode (interactive)
pnpm test:ui

# Run only Chromium (faster)
pnpm test:chromium

# Run specific test file
pnpm exec playwright test tests/tools.spec.ts

# Run specific test
pnpm exec playwright test -g "JSON Formatter"

# Debug mode
pnpm exec playwright test --debug
```

## Viewing Results

After tests complete:
```bash
# View HTML report
pnpm test:report

# Or
pnpm exec playwright show-report
```

## Making Tests More Flexible

If tests are failing but your site works, the tests might be too strict. You can:

1. **Check what's actually on the page**:
   ```bash
   pnpm exec playwright test --debug
   ```

2. **Take a screenshot**:
   Tests automatically take screenshots on failure in `test-results/`

3. **Adjust selectors** in `tests/tools.spec.ts` to match your actual HTML structure
