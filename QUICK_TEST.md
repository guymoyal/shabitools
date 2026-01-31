# ⚡ Quick Test Guide - 5 Minutes Per Tool

## 🚀 Quick Test Process

For each tool, spend **5 minutes** testing:

1. **Open the tool** (30 seconds)
2. **Test basic functionality** (2 minutes)
3. **Test dark mode** (30 seconds)
4. **Test mobile** (1 minute)
5. **Check console for errors** (1 minute)

---

## 📋 Quick Test Checklist

### ✅ Pass Criteria
- Tool loads without errors
- Basic functionality works
- Dark mode looks good
- Mobile layout works
- No console errors

### ❌ Fail Criteria
- Tool doesn't load
- Core functionality broken
- Console errors
- Layout broken on mobile
- Dark mode unusable

---

## 🎯 Priority Testing Order

### 🔴 Critical (Test First)
1. Visual Page Compare ⭐
2. JSON Formatter
3. API Tester
4. Base64 Encoder
5. Regex Tester

### 🟡 Important (Test Second)
6. QR Code Generator
7. Password Generator
8. Color Contrast Checker
9. Markdown Editor
10. Code Formatter

### 🟢 Standard (Test Third)
11-28. All remaining tools

---

## 🔍 Quick Test Commands

### Start Dev Server
```bash
pnpm dev
```

### Open All Tools (Copy-paste in browser console)
```javascript
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
  '/tools/lorem-ipsum'
];

tools.forEach((tool, i) => {
  setTimeout(() => {
    window.open(`http://localhost:3000${tool}`, `_blank`);
  }, i * 1000);
});
```

---

## 📝 Test Results Template

```
Tool: [Name]
URL: /tools/[name]
Status: ✅ Pass / ❌ Fail
Issues: [List issues]
Priority: High / Medium / Low
```

---

## 🐛 Common Issues & Quick Fixes

### Issue: Tool doesn't load
**Check**: Browser console for errors
**Fix**: Check component imports

### Issue: Dark mode broken
**Check**: Tailwind dark: classes
**Fix**: Add dark mode styles

### Issue: Mobile layout broken
**Check**: Responsive classes
**Fix**: Add mobile breakpoints

### Issue: Button doesn't work
**Check**: onClick handlers
**Fix**: Check event handlers

---

**Time Estimate**: 2-3 hours for all 28 tools (5 min each)
