# 🧪 Testing Checklist - All Tools

## 📋 How to Use This Checklist

1. **Open each tool** in your browser (dev mode: `pnpm dev`)
2. **Test basic functionality** - Does it work?
3. **Test edge cases** - What happens with invalid input?
4. **Test dark mode** - Does it look good?
5. **Test mobile** - Does it work on small screens?
6. **Mark as ✅ or ❌** - Note any issues

---

## ✅ Tool Testing Checklist

### Developer Tools

#### 1. JSON Formatter (`/tools/json-formatter`)
- [ ] **Basic**: Paste JSON, click format - formats correctly
- [ ] **Validation**: Invalid JSON shows error
- [ ] **Minify**: Minify button works
- [ ] **Tree View**: Tree view toggle works
- [ ] **Dark Mode**: Looks good in dark mode
- [ ] **Mobile**: Works on mobile
- **Test Input**: `{"name":"test","value":123}`
- **Issues**: ________________

#### 2. Regex Tester (`/tools/regex-tester`)
- [ ] **Basic**: Enter regex pattern, test string - matches shown
- [ ] **Real-time**: Matches update as you type
- [ ] **Pattern Library**: Common patterns work
- [ ] **Invalid Regex**: Shows error message
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test Input**: Pattern: `\d+`, String: `123abc`
- **Issues**: ________________

#### 3. Base64 Encoder (`/tools/base64-encoder`)
- [ ] **Encode**: Text to Base64 works
- [ ] **Decode**: Base64 to text works
- [ ] **Invalid Base64**: Shows error
- [ ] **Copy Button**: Copy works
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test Input**: `Hello World`
- **Issues**: ________________

#### 4. API Tester (`/tools/api-tester`)
- [ ] **GET Request**: Can make GET request
- [ ] **POST Request**: Can make POST with body
- [ ] **Headers**: Can add custom headers
- [ ] **Response**: Shows response correctly
- [ ] **Error Handling**: Invalid URL shows error
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test URL**: `https://jsonplaceholder.typicode.com/posts/1`
- **Issues**: ________________

#### 5. Visual Page Compare (`/tools/visual-diff`) ⭐ MOST IMPORTANT
- [ ] **Side-by-Side**: Two URLs compare side-by-side
- [ ] **Overlay Mode**: Overlay mode works
- [ ] **Blend Mode**: Blend mode works
- [ ] **Onion Mode**: Onion mode with opacity works
- [ ] **Viewport Width**: Can change width (375, 768, 1200, custom)
- [ ] **Synchronized Scroll**: Both scroll together
- [ ] **URL Sharing**: URL params work (share link)
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test URLs**: 
  - URL1: `https://example.com`
  - URL2: `https://www.example.com`
- **Issues**: ________________

#### 6. Page Speed Compare (`/tools/page-speed-compare`)
- [ ] **Single URL**: Can test one URL
- [ ] **Multiple URLs**: Can compare multiple URLs
- [ ] **Results**: Shows performance metrics
- [ ] **Error Handling**: Invalid URL shows error
- [ ] **Loading State**: Shows loading indicator
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test URL**: `https://example.com`
- **Issues**: ________________

#### 7. Markdown Editor (`/tools/markdown-editor`)
- [ ] **Type Markdown**: Can type markdown
- [ ] **Live Preview**: Preview updates in real-time
- [ ] **Formatting**: Bold, italic, headers work
- [ ] **Export**: Can export/copy HTML
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test Input**: `# Hello **World**`
- **Issues**: ________________

#### 8. Code Formatter (`/tools/code-formatter`)
- [ ] **Select Language**: Can select language
- [ ] **Format**: Formats code correctly
- [ ] **Multiple Languages**: Works for JS, TS, Python, HTML, CSS
- [ ] **Invalid Code**: Shows error
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test Input**: `const x=1+2;`
- **Issues**: ________________

#### 9. CSS Minifier (`/tools/css-minifier`)
- [ ] **Minify**: Minifies CSS correctly
- [ ] **Before/After**: Shows comparison
- [ ] **Copy**: Copy button works
- [ ] **Invalid CSS**: Handles gracefully
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test Input**: `body { color: red; }`
- **Issues**: ________________

#### 10. YAML Formatter (`/tools/yaml-formatter`)
- [ ] **Format**: Formats YAML correctly
- [ ] **Validate**: Validates YAML syntax
- [ ] **Error**: Invalid YAML shows error
- [ ] **Copy**: Copy button works
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test Input**: `name: test\nvalue: 123`
- **Issues**: ________________

#### 11. Email Validator (`/tools/email-validator`)
- [ ] **Valid Email**: Accepts valid email
- [ ] **Invalid Email**: Rejects invalid email
- [ ] **Domain Check**: Checks domain (if implemented)
- [ ] **Bulk Validation**: Can validate multiple emails
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test Input**: `test@example.com`
- **Issues**: ________________

#### 12. JWT Decoder (`/tools/jwt-decoder`)
- [ ] **Decode**: Decodes JWT token
- [ ] **Header/Payload**: Shows header and payload
- [ ] **Validation**: Validates token structure
- [ ] **Expiration**: Shows expiration (if valid)
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test Input**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
- **Issues**: ________________

#### 13. IP Address Info (`/tools/ip-address-info`)
- [ ] **Lookup**: Can lookup IP address
- [ ] **Own IP**: Shows own IP (if implemented)
- [ ] **Geolocation**: Shows location info
- [ ] **ISP Info**: Shows ISP information
- [ ] **Error Handling**: Invalid IP shows error
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test Input**: `8.8.8.8`
- **Issues**: ________________

#### 14. JSON to CSV (`/tools/json-to-csv`)
- [ ] **Convert**: Converts JSON array to CSV
- [ ] **Nested Objects**: Handles nested objects
- [ ] **Download**: Download button works
- [ ] **Copy**: Copy button works
- [ ] **Error**: Invalid JSON shows error
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test Input**: `[{"name":"test","value":123}]`
- **Issues**: ________________

#### 15. CSV to JSON (`/tools/csv-to-json`)
- [ ] **Convert**: Converts CSV to JSON
- [ ] **Headers**: Detects headers correctly
- [ ] **Download**: Download button works
- [ ] **Copy**: Copy button works
- [ ] **Error**: Invalid CSV handles gracefully
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test Input**: `name,value\ntest,123`
- **Issues**: ________________

#### 16. JSON Diff (`/tools/json-diff`)
- [ ] **Compare**: Compares two JSON objects
- [ ] **Visual Diff**: Shows differences visually
- [ ] **Added/Removed**: Highlights added/removed properties
- [ ] **Nested**: Handles nested objects
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test Input**: 
  - JSON1: `{"a":1,"b":2}`
  - JSON2: `{"a":1,"b":3,"c":4}`
- **Issues**: ________________

#### 17. Text Diff (`/tools/text-diff`)
- [ ] **Compare**: Compares two text strings
- [ ] **Side-by-Side**: Side-by-side view works
- [ ] **Unified**: Unified view works
- [ ] **Highlighting**: Differences highlighted
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test Input**: 
  - Text1: `Hello World`
  - Text2: `Hello Universe`
- **Issues**: ________________

#### 18. URL Parser (`/tools/url-parser`)
- [ ] **Parse**: Parses URL components
- [ ] **Query Params**: Extracts query parameters
- [ ] **Protocol**: Shows protocol
- [ ] **Domain**: Shows domain
- [ ] **Path**: Shows path
- [ ] **SEO Analysis**: Shows SEO score (if implemented)
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test Input**: `https://example.com/path?key=value`
- **Issues**: ________________

#### 19. UUID Generator (`/tools/uuid-generator`)
- [ ] **Generate**: Generates UUID
- [ ] **Multiple**: Can generate multiple UUIDs
- [ ] **Copy**: Copy button works
- [ ] **Format**: UUID format is correct (RFC 4122)
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test**: Click generate button
- **Issues**: ________________

#### 20. HTML Encoder (`/tools/html-encoder`)
- [ ] **Encode**: Encodes HTML entities
- [ ] **Decode**: Decodes HTML entities
- [ ] **Copy**: Copy button works
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test Input**: `<div>Hello</div>`
- **Issues**: ________________

#### 21. Timestamp Converter (`/tools/timestamp-converter`)
- [ ] **Unix to Date**: Converts Unix timestamp to date
- [ ] **Date to Unix**: Converts date to Unix timestamp
- [ ] **Timezone**: Timezone selection works (if implemented)
- [ ] **Multiple Formats**: Shows different date formats
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test Input**: `1640995200` (Unix timestamp)
- **Issues**: ________________

#### 22. Image Converter (`/tools/image-converter`)
- [ ] **Upload Image**: Can upload image
- [ ] **Convert Format**: Converts PNG/JPEG/WebP
- [ ] **Quality**: Quality slider works
- [ ] **Download**: Download converted image works
- [ ] **File Size**: Shows file size comparison
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test**: Upload a PNG image
- **Issues**: ________________

---

### Design Tools

#### 23. Color Contrast Checker (`/tools/color-contrast-checker`)
- [ ] **Pick Colors**: Can pick foreground/background colors
- [ ] **Contrast Ratio**: Shows contrast ratio
- [ ] **WCAG**: Shows WCAG compliance
- [ ] **Suggestions**: Shows suggestions (if implemented)
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test**: Pick two colors
- **Issues**: ________________

#### 24. Color Palette Generator (`/tools/color-palette-generator`)
- [ ] **Generate Palette**: Generates color palette
- [ ] **Palette Types**: Different palette types work
- [ ] **Image Upload**: Can extract colors from image (if implemented)
- [ ] **Export**: Can export CSS/JSON
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test**: Generate a palette
- **Issues**: ________________

---

### General Tools

#### 25. QR Code Generator (`/tools/qr-generator`)
- [ ] **Generate QR**: Generates QR code from text/URL
- [ ] **Customize**: Size/color customization works
- [ ] **Download**: Download button works
- [ ] **Different Types**: WiFi, Email, etc. work (if implemented)
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test Input**: `https://example.com`
- **Issues**: ________________

#### 26. Password Generator (`/tools/password-generator`)
- [ ] **Generate**: Generates password
- [ ] **Length**: Length slider works
- [ ] **Options**: Uppercase, lowercase, numbers, symbols work
- [ ] **Strength**: Shows password strength
- [ ] **Copy**: Copy button works
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test**: Generate password with different options
- **Issues**: ________________

#### 27. Text Counter (`/tools/text-counter`)
- [ ] **Count**: Counts words, characters, sentences
- [ ] **Real-time**: Updates as you type
- [ ] **Statistics**: Shows detailed statistics
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test Input**: `Hello world. This is a test.`
- **Issues**: ________________

#### 28. Lorem Ipsum Generator (`/tools/lorem-ipsum`)
- [ ] **Generate**: Generates Lorem Ipsum text
- [ ] **Paragraphs**: Can specify number of paragraphs
- [ ] **Words**: Can specify number of words
- [ ] **Copy**: Copy button works
- [ ] **Dark Mode**: Looks good
- [ ] **Mobile**: Works on mobile
- **Test**: Generate 3 paragraphs
- **Issues**: ________________

---

## 🎯 Quick Test Script

Run this in your browser console on each tool page to check for errors:

```javascript
// Check for console errors
console.log('Testing:', window.location.pathname);
// Look for any red errors in console
```

---

## 📱 Mobile Testing

Test each tool on:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Desktop (Chrome/Firefox)

---

## 🌙 Dark Mode Testing

For each tool:
- [ ] Toggle dark mode
- [ ] Check text is readable
- [ ] Check buttons are visible
- [ ] Check inputs are visible
- [ ] Check contrast is good

---

## 🐛 Common Issues to Look For

- [ ] **JavaScript Errors**: Check browser console
- [ ] **Broken Layout**: Elements overlapping or cut off
- [ ] **Missing Functionality**: Buttons that don't work
- [ ] **Poor UX**: Confusing interface
- [ ] **Performance**: Slow loading or laggy
- [ ] **Accessibility**: Can't use keyboard navigation

---

## 📊 Testing Summary

**Total Tools**: 28
**Tested**: ___
**Working**: ___
**Broken**: ___
**Needs Fix**: ___

**Critical Issues**: ________________

**Priority Fixes**: ________________

---

## ✅ After Testing

1. **Fix Critical Issues** - Tools that don't work at all
2. **Fix UI Issues** - Dark mode, mobile, layout problems
3. **Improve UX** - Confusing interfaces, missing features
4. **Document Issues** - Note what needs improvement

---

**Happy Testing! 🧪**
