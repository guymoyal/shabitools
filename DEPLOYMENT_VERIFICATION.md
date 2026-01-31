# Deployment Verification Checklist

## ✅ Quick Verification Steps

### 1. **Meta Tag Verification** (AdSense)

**Check if meta tag is present:**

1. Visit your deployed site: `https://yourdomain.com`
2. **Right-click** → **View Page Source** (or `Cmd+U` / `Ctrl+U`)
3. **Search for**: `google-adsense-account`
4. **Should see**: `<meta name="google-adsense-account" content="ca-pub-2858012859068424">`

**✅ PASS** if you see the meta tag in the `<head>` section

---

### 2. **ads.txt File Verification**

**Check if ads.txt is accessible:**

1. Visit: `https://yourdomain.com/ads.txt`
2. **Should see**: `google.com, pub-2858012859068424, DIRECT, f08c47fec0942fa0`

**✅ PASS** if the file loads and shows the correct content

**Alternative check:**
```bash
curl https://yourdomain.com/ads.txt
```

---

### 3. **AdSense Script Verification**

**Check if AdSense script is loading:**

1. Visit your deployed site
2. Open **Browser DevTools** (F12 or Right-click → Inspect)
3. Go to **Network** tab
4. **Refresh the page**
5. **Filter by**: `adsbygoogle`
6. **Should see**: Request to `pagead2.googlesyndication.com`

**✅ PASS** if you see the AdSense script loading

**Alternative check:**
- Go to **Console** tab
- Look for any AdSense-related errors (should be none)

---

### 4. **Site Functionality Check**

**Test key pages:**

1. **Homepage**: `https://yourdomain.com`
   - ✅ Should load without errors
   - ✅ Logo visible
   - ✅ Navigation works

2. **Tools Page**: `https://yourdomain.com/tools`
   - ✅ All tools listed
   - ✅ Links work

3. **Sample Tool**: `https://yourdomain.com/tools/json-formatter`
   - ✅ Tool loads
   - ✅ Tool functions work

4. **Contact Page**: `https://yourdomain.com/contact`
   - ✅ Page loads
   - ✅ Form visible

---

### 5. **SEO Files Verification**

**Check robots.txt:**
- Visit: `https://yourdomain.com/robots.txt`
- ✅ Should see: `User-agent: *` and `Allow: /`

**Check sitemap.xml:**
- Visit: `https://yourdomain.com/sitemap.xml`
- ✅ Should see XML with all pages listed

---

### 6. **Buy Me a Coffee Widget**

**Check if widget appears:**

1. Visit any tool page (e.g., `/tools/json-formatter`)
2. **Look for**: Buy Me a Coffee floating button/widget
3. ✅ Should be visible (usually bottom-right)

---

### 7. **Mobile Responsiveness**

**Quick mobile check:**

1. Open DevTools (F12)
2. Click **Toggle device toolbar** (or `Cmd+Shift+M`)
3. Select a mobile device (e.g., iPhone 12)
4. ✅ Site should be responsive
5. ✅ Navigation should work
6. ✅ Tools should be usable

---

## 🔍 Advanced Verification

### Check Console for Errors

1. Open DevTools → **Console** tab
2. Refresh page
3. **Should see**: Minimal errors (only expected ones like favicon warnings)
4. **Should NOT see**: JavaScript errors, 404s for critical resources

### Check Network Requests

1. Open DevTools → **Network** tab
2. Refresh page
3. **Check**:
   - ✅ All resources load (status 200)
   - ✅ No critical 404s
   - ✅ AdSense script loads
   - ✅ Images load

### Performance Check

1. Open DevTools → **Lighthouse** tab
2. Run audit for:
   - Performance
   - SEO
   - Accessibility
3. **Target scores**: 80+ for each

---

## 📋 AdSense Dashboard Verification

### In Google AdSense:

1. **Go to**: https://www.google.com/adsense
2. **Sites** → **Add site** (if not already added)
3. **Enter your domain**: `yourdomain.com`
4. **Click Verify**
5. **Wait 5-10 minutes**
6. **Check status**: Should show "Verified" ✅

**If verification fails:**
- Double-check meta tag is in page source
- Verify ads.txt is accessible
- Wait a bit longer (can take up to 24 hours)
- Check AdSense dashboard for specific error messages

---

## 🚨 Common Issues & Fixes

### Issue: Meta tag not found
**Fix**: 
- Ensure site is deployed
- Check page source (not just DevTools Elements)
- Verify metadata in `app/layout.tsx`

### Issue: ads.txt returns 404
**Fix**:
- Ensure file is in `public/ads.txt`
- Rebuild and redeploy
- Check file permissions

### Issue: AdSense script not loading
**Fix**:
- Check browser console for errors
- Verify ad blockers are disabled
- Check network tab for blocked requests

### Issue: Site not loading
**Fix**:
- Check Cloudflare Pages deployment logs
- Verify build succeeded
- Check domain DNS settings

---

## ✅ Final Checklist

- [ ] Meta tag present in page source
- [ ] ads.txt accessible at `/ads.txt`
- [ ] AdSense script loading
- [ ] Homepage loads correctly
- [ ] Tools page loads correctly
- [ ] Sample tool works
- [ ] Contact page loads
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] Buy Me a Coffee widget visible
- [ ] Mobile responsive
- [ ] No critical console errors
- [ ] AdSense dashboard shows "Verified"

---

## 🎯 Quick Test URLs

Replace `yourdomain.com` with your actual domain:

```
https://yourdomain.com
https://yourdomain.com/tools
https://yourdomain.com/tools/json-formatter
https://yourdomain.com/contact
https://yourdomain.com/ads.txt
https://yourdomain.com/robots.txt
https://yourdomain.com/sitemap.xml
```

---

**Once all checks pass, your site is ready! 🚀**
