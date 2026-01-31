# AdSense Verification Meta Tag

## ✅ What's Implemented

The AdSense verification is set up in **three ways**:

### 1. Meta Tag via Metadata API (Primary Method)
In `app/layout.tsx`:
```typescript
other: {
  'google-adsense-account': 'ca-pub-2858012859068424',
}
```

This renders: `<meta name="google-adsense-account" content="ca-pub-2858012859068424">`

### 2. AdSense Script
The AdSense script is loaded:
```typescript
<AutoAds />
```

This loads: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2858012859068424`

### 3. ads.txt File ✅
Located at `public/ads.txt`:
```
google.com, pub-2858012859068424, DIRECT, f08c47fec0942fa0
```

This file will be accessible at: `https://shabitools.com/ads.txt`

**Why ads.txt is important:**
- Authorizes Google to sell ads on your site
- Prevents unauthorized ad sales
- Required for AdSense revenue
- Must be accessible at root domain (`/ads.txt`)

---

## 🔍 How to Verify It's Working

### Method 1: Check Page Source (Meta Tag)

1. **Deploy your site** (or run locally)
2. **View page source** (Right-click → View Page Source)
3. **Search for**: `google-adsense-account`
4. **Should see**: `<meta name="google-adsense-account" content="ca-pub-2858012859068424">`

### Method 2: Check ads.txt File

1. **Deploy your site**
2. **Visit**: `https://yourdomain.com/ads.txt`
3. **Should see**: `google.com, pub-2858012859068424, DIRECT, f08c47fec0942fa0`

### Method 3: Check Browser DevTools

1. Open DevTools (F12)
2. Go to **Elements** tab
3. Expand `<head>` section
4. Look for the meta tag

### Method 4: Test Locally

```bash
# Start dev server
pnpm dev

# Visit http://localhost:3000
# View page source
# Search for "google-adsense-account"
```

---

## 📋 Verification Steps in AdSense

1. **Go to AdSense Dashboard**
   - https://www.google.com/adsense
   - Sites → Add site

2. **Enter your domain**
   - Example: `shabitools.com` or `shabitools.pages.dev`

3. **Choose verification method**
   - Select "HTML tag" or "Meta tag"
   - Google will look for the meta tag

4. **Wait for verification**
   - Usually takes a few minutes
   - Google crawls your site to find the tag

---

## ⚠️ Important Notes

1. **Site must be live** - Google needs to access your site to verify
2. **Meta tag must be in `<head>`** - Which it is via metadata API
3. **Wait a few minutes** - Verification isn't instant
4. **Check AdSense dashboard** - Status will update there

---

## 🚀 After Verification

Once verified:
- ✅ Ads will start appearing (may take 24-48 hours)
- ✅ You can create ad units
- ✅ Revenue tracking begins

---

## 🔧 Troubleshooting

### Meta tag not found?

1. **Deploy your site first** - Google needs live access
2. **Check page source** - Verify tag is rendered
3. **Wait 5-10 minutes** - Google needs time to crawl
4. **Try re-verifying** - In AdSense dashboard

### ads.txt not accessible?

1. **Check file location** - Must be in `public/ads.txt`
2. **Check URL** - Visit `https://yourdomain.com/ads.txt`
3. **Check file content** - Should match AdSense dashboard exactly
4. **Wait 24-48 hours** - Google crawls ads.txt periodically

### Still not working?

1. **Check domain matches** - Must match exactly
2. **Check HTTPS** - Site must be HTTPS
3. **Check robots.txt** - Should allow Googlebot
4. **Contact AdSense support** - If still stuck

---

**Current Status**: 
- ✅ Meta tag added via metadata API
- ✅ AdSense script loaded
- ✅ ads.txt file created

**Next Step**: Deploy site and verify in AdSense dashboard

**After Deployment, verify:**
1. Meta tag: View page source → search "google-adsense-account"
2. ads.txt: Visit `https://yourdomain.com/ads.txt`
3. AdSense dashboard: Sites → Verify
