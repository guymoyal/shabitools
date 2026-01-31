# Automated Testing with Playwright

This directory contains automated tests for all shabitools.

## 🚀 Quick Start

### Install Dependencies
```bash
pnpm install
```

### Install Playwright Browsers
```bash
pnpm exec playwright install
```

### Run Tests
```bash
# Run all tests
pnpm test

# Run tests in UI mode (interactive)
pnpm test:ui

# Run tests for specific browser
pnpm test:chromium

# Run tests and generate report
pnpm test:report
```

## 📋 What Gets Tested

### 1. Basic Functionality Tests
- ✅ All 28 tools load without errors
- ✅ No 404 pages
- ✅ Pages render correctly
- ✅ No console errors

### 2. Dark Mode Tests
- ✅ Dark mode toggle works on all pages
- ✅ Theme switches correctly

### 3. Mobile Responsive Tests
- ✅ All tools work on mobile viewport (375px)
- ✅ No horizontal scrolling issues
- ✅ Screenshots saved for visual verification

### 4. Specific Tool Tests
- ✅ JSON Formatter formats JSON
- ✅ QR Generator generates QR codes
- ✅ Password Generator generates passwords
- ✅ UUID Generator generates UUIDs
- ✅ Visual Page Compare loads interface
- ✅ Base64 Encoder encodes text

### 5. Navigation Tests
- ✅ Homepage loads
- ✅ Tools page lists all tools
- ✅ Header navigation works
- ✅ Buy Me a Coffee widget appears

## 📊 Test Results

After running tests, view the HTML report:
```bash
pnpm exec playwright show-report
```

Screenshots of failures are saved in `tests/screenshots/`

## 🔧 Configuration

Tests are configured in `playwright.config.ts`:
- Base URL: `http://localhost:3000` (dev server)
- Browsers: Chromium, Firefox, WebKit
- Mobile: Chrome Mobile, Safari Mobile
- Auto-starts dev server before tests

## 📝 Adding New Tests

To add a test for a new tool:

1. Add tool to `tools` array in `tests/tools.spec.ts`
2. Add specific functionality test if needed
3. Run tests: `pnpm test`

## 🐛 Debugging Failed Tests

### Run in Debug Mode
```bash
pnpm exec playwright test --debug
```

### Run Specific Test
```bash
pnpm exec playwright test tests/tools.spec.ts -g "JSON Formatter"
```

### View Screenshots
Check `tests/screenshots/` folder for failure screenshots

## 📈 CI/CD Integration

Tests can be run in CI/CD:
```bash
# In CI, tests run against production
BASE_URL=https://shabitools.com pnpm test
```

## 🎯 Test Coverage

- ✅ All 28 implemented tools
- ✅ Dark mode on all pages
- ✅ Mobile responsive on all pages
- ✅ Navigation and UI elements
- ✅ Critical tool functionality

## 💡 Tips

1. **Run tests before deploying** - Catch issues early
2. **Check screenshots** - Visual verification of mobile layout
3. **Fix console errors** - Even if tests pass, fix errors
4. **Update tests** - When adding new tools, add tests

---

**Happy Testing! 🧪**
