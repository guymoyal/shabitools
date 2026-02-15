# 🚀 Quick Deployment Guide

## ✅ **For Production (Recommended)**

Use this command to deploy to production:

```bash
pnpm deploy:production
```

**What it does:**
1. ✅ Builds your site (`pnpm build`)
2. ✅ Deploys to `main` branch (production)
3. ✅ Updates your live site automatically

**This is the ONE command you need!** 🎯

---

## 📋 All Deployment Scripts Explained

### Production Scripts

| Script | Command | What It Does |
|--------|---------|--------------|
| **`deploy:production`** | `pnpm deploy:production` | ✅ **USE THIS** - Builds & deploys to production (`main` branch) |
| `deploy` | `pnpm deploy` | Same as `deploy:production` (shorthand) |

### Preview/Testing Scripts

| Script | Command | What It Does |
|--------|---------|--------------|
| `deploy:preview` | `pnpm deploy:preview` | Builds & deploys to `preview` branch (for testing) |

### Cloudflare Setup Scripts

| Script | Command | What It Does |
|--------|---------|--------------|
| `cf:login` | `pnpm cf:login` | Logs you into Cloudflare (first time only) |
| `cf:whoami` | `pnpm cf:whoami` | Shows who you're logged in as |
| `cf:deploy` | `pnpm cf:deploy` | Builds & deploys (no branch specified) |

---

## 🎯 Step-by-Step: Deploy to Production

### Step 1: Make sure you're logged in

```bash
pnpm cf:whoami
```

**If not logged in:**
```bash
pnpm cf:login
```
(This opens your browser to authenticate)

### Step 2: Deploy!

```bash
pnpm deploy:production
```

**That's it!** 🎉

### Step 3: Wait 2-3 minutes

Your site will be live at your Cloudflare Pages URL.

---

## 🔍 Verify Deployment

After deploying, check:

1. **Your site URL** (e.g., `https://shabitools.pages.dev`)
2. **robots.txt**: `https://yourdomain.com/robots.txt` (should show `Allow: /`)
3. **ads.txt**: `https://yourdomain.com/ads.txt` (should show your AdSense code)

---

## ⚠️ Important Notes

### First Time Setup

If this is your first deployment, you might need to:

1. **Create the Cloudflare Pages project:**
   ```bash
   wrangler pages project create shabitools
   ```

2. **Then deploy:**
   ```bash
   pnpm deploy:production
   ```

### If Deployment Fails

**Check:**
- ✅ Are you logged in? (`pnpm cf:whoami`)
- ✅ Does the project exist? (`wrangler pages project list`)
- ✅ Did the build succeed? (Check for `out/` directory)

**Common fixes:**
```bash
# Login again
pnpm cf:login

# Create project if missing
wrangler pages project create shabitools

# Try deploying again
pnpm deploy:production
```

---

## 📝 Summary

**For production:** 
```bash
pnpm deploy:production
```

**For testing:**
```bash
pnpm deploy:preview
```

**That's all you need to know!** 🚀
