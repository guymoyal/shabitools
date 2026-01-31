# 🚀 Deployment Steps - shabitools

## ✅ Pre-Deployment Checklist

Before deploying, make sure:

- [x] ✅ AdSense script added (Publisher ID: ca-pub-2858012859068424)
- [x] ✅ Buy Me a Coffee integrated
- [x] ✅ SEO optimized (robots.txt, sitemap, meta tags)
- [x] ✅ All tools tested
- [ ] ⚠️ Test AdSense ads appear (may take 24-48 hours after approval)
- [ ] ⚠️ Create ad units in AdSense dashboard (for manual ad placements)

---

## 📋 Step-by-Step Deployment

### Step 1: Test Locally

```bash
# Start dev server
pnpm dev

# Visit http://localhost:3000
# Check that:
# - All pages load
# - AdSense script loads (check browser console)
# - No errors
```

### Step 2: Build the Site

```bash
# Build for production
pnpm build

# Verify build succeeded
# Check that 'out/' directory was created
ls -la out/
```

### Step 3: Test Build Locally (Optional)

```bash
# Test production build locally
pnpm start

# Visit http://localhost:3000
# Test a few tools to make sure everything works
```

### Step 4: Deploy to Cloudflare Pages

#### Option A: Using pnpm script (Recommended)

```bash
# Make sure you're logged in
pnpm cf:whoami

# If not logged in:
pnpm cf:login

# Deploy to production
pnpm deploy:production
```

#### Option B: Manual deployment

```bash
# Build first
pnpm build

# Deploy
wrangler pages deploy out --branch main --project-name=shabitools
```

### Step 5: Verify Deployment

1. **Check Cloudflare Dashboard**
   - Go to: https://dash.cloudflare.com/pages/view/shabitools
   - Verify deployment succeeded
   - Check deployment URL

2. **Visit Your Site**
   - Visit: `https://shabitools.pages.dev` (or your custom domain)
   - Test a few tools
   - Check AdSense script loads (browser console)

3. **Check AdSense**
   - Go to AdSense dashboard
   - Verify site is connected
   - Ads may take 24-48 hours to start showing

---

## 🔧 Troubleshooting

### Build Fails

```bash
# Check for errors
pnpm build

# Fix TypeScript errors
pnpm lint

# Check Node version (needs 18+)
node --version
```

### Deployment Fails

```bash
# Check authentication
pnpm cf:whoami

# Re-login if needed
pnpm cf:login

# Check project exists
wrangler pages project list

# Create project if needed
wrangler pages project create shabitools
```

### Ads Not Showing

1. **Wait 24-48 hours** - AdSense needs time to review and activate
2. **Check AdSense dashboard** - Verify site is approved
3. **Check browser console** - Look for AdSense errors
4. **Disable ad blockers** - Test without ad blockers
5. **Check ad units** - If using manual ads, verify ad slot IDs are correct

---

## 📊 Post-Deployment

### 1. Set Up Custom Domain (Optional)

1. Go to Cloudflare Pages dashboard
2. Settings → Custom domains
3. Add your domain
4. Update DNS records as instructed

### 2. Set Up Google Analytics (Recommended)

1. Create Google Analytics account
2. Get tracking ID
3. Add to `app/layout.tsx`:

```tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>
```

### 3. Submit Sitemap to Google Search Console

1. Go to Google Search Console
2. Add property: `https://shabitools.com`
3. Submit sitemap: `https://shabitools.com/sitemap.xml`

### 4. Monitor Performance

- **AdSense**: Check revenue and ad performance
- **Analytics**: Monitor traffic and user behavior
- **Search Console**: Monitor search performance

---

## 🎯 Quick Deploy Command

```bash
# One command to deploy everything
pnpm build && pnpm deploy:production
```

---

## ✅ Success Checklist

After deployment:

- [ ] Site is accessible at your domain
- [ ] All tools work correctly
- [ ] AdSense script loads (check console)
- [ ] Buy Me a Coffee widget appears
- [ ] Mobile responsive works
- [ ] Dark mode works
- [ ] SEO tags are correct
- [ ] Sitemap is accessible

---

**Ready to deploy? Run:**

```bash
pnpm build && pnpm deploy:production
```

Good luck! 🚀
