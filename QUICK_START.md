# 🚀 Quick Start - Deploy shabitools

## ✅ Pre-Deployment Checklist

- [x] ✅ AdSense script added (ca-pub-2858012859068424)
- [x] ✅ Buy Me a Coffee integrated (guymo)
- [x] ✅ SEO optimized
- [x] ✅ Git initialized
- [ ] ⚠️ Connect to remote repository (GitHub/GitLab)
- [ ] ⚠️ Test locally
- [ ] ⚠️ Deploy to Cloudflare Pages

---

## 📋 Step-by-Step Deployment

### Step 1: Connect to Git Repository (Optional but Recommended)

#### Option A: GitHub

1. **Create repository on GitHub**
   - Go to: https://github.com/new
   - Name: `shabitools`
   - Don't initialize with README
   - Click "Create repository"

2. **Connect local repository**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/shabitools.git
   git branch -M main
   git push -u origin main
   ```

#### Option B: Skip Git (Deploy Directly)

You can deploy without Git, but Git is recommended for version control.

---

### Step 2: Test Locally

```bash
# Start dev server
pnpm dev

# Visit http://localhost:3000
# Test a few tools
# Check browser console for AdSense script
```

---

### Step 3: Build

```bash
# Build for production
pnpm build

# Verify build succeeded
ls -la out/
```

---

### Step 4: Deploy to Cloudflare Pages

#### Method 1: Using CLI (Recommended)

```bash
# Login to Cloudflare
pnpm cf:login

# Verify login
pnpm cf:whoami

# Deploy
pnpm deploy:production
```

#### Method 2: Using Dashboard

1. Go to: https://dash.cloudflare.com/pages
2. Create new project: `shabitools`
3. Upload `out/` directory
4. Deploy

---

### Step 5: Verify Deployment

1. Visit your site: `https://shabitools.pages.dev`
2. Test tools
3. Check AdSense script loads (browser console)
4. Test mobile view
5. Test dark mode

---

## 🎯 One-Command Deploy

```bash
pnpm build && pnpm deploy:production
```

---

## 📊 After Deployment

1. **Set up custom domain** (optional)
   - Cloudflare Pages → Settings → Custom domains

2. **Submit sitemap to Google**
   - Google Search Console
   - Submit: `https://shabitools.com/sitemap.xml`

3. **Monitor AdSense**
   - Wait 24-48 hours for ads to appear
   - Check AdSense dashboard

---

## 🔧 Troubleshooting

### Build fails
```bash
pnpm install
pnpm build
```

### Deployment fails
```bash
pnpm cf:login
pnpm cf:whoami
```

### Ads not showing
- Wait 24-48 hours
- Check AdSense dashboard
- Disable ad blockers

---

**Ready? Run:**

```bash
pnpm build && pnpm deploy:production
```

🚀 **Good luck!**
