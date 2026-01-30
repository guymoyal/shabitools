# Cloudflare Pages Setup Guide

## Step 1: Check Authentication

First, make sure you're logged in to Cloudflare:

```bash
wrangler whoami
```

**If not logged in**, run:
```bash
wrangler login
```
This will open your browser to authenticate.

---

## Step 2: Check if Project Exists

List all your Pages projects:

```bash
wrangler pages project list
```

**Look for:** `shabitools` in the list

---

## Step 3: Create Project (if it doesn't exist)

If `shabitools` is NOT in the list, create it:

```bash
wrangler pages project create shabitools
```

**Output should show:**
```
✨ Successfully created the 'shabitools' project
```

---

## Step 4: Deploy to Production

Once the project exists, deploy:

```bash
# Make sure you're in the project directory
cd /Users/guym/Projects/shabitools

# Build the site
pnpm build

# Deploy to production (main branch)
wrangler pages deploy out --branch main --project-name=shabitools
```

**OR use the npm script:**
```bash
pnpm deploy:production
```

---

## Important Notes:

### ❌ **No Bindings Needed!**

**Pages projects don't need bindings** - that's only for Cloudflare Workers. Pages projects are just static sites, so you don't need to configure bindings.

### ✅ **What You Need:**

1. ✅ Cloudflare account (you have this)
2. ✅ Authenticated with `wrangler login` (check with `wrangler whoami`)
3. ✅ Project created (`wrangler pages project create shabitools`)
4. ✅ Build output (`pnpm build` creates `out/` directory)
5. ✅ Deploy (`wrangler pages deploy out --branch main`)

---

## Troubleshooting:

### If `wrangler login` fails:
- Make sure you have a Cloudflare account
- Try: `wrangler login --scopes-list`
- Check: https://dash.cloudflare.com/profile/api-tokens

### If project creation fails:
- Check you have Pages access in your Cloudflare account
- Verify account: https://dash.cloudflare.com/
- Try creating via dashboard: https://dash.cloudflare.com/pages

### If deployment fails:
- Make sure `out/` directory exists: `ls -la out/`
- Check `out/index.html` exists: `test -f out/index.html && echo "OK" || echo "MISSING"`
- Verify project name matches: `wrangler pages project list`

---

## Quick Command Sequence:

```bash
# 1. Check login
wrangler whoami

# 2. List projects
wrangler pages project list

# 3. Create project (if needed)
wrangler pages project create shabitools

# 4. Build
pnpm build

# 5. Deploy
wrangler pages deploy out --branch main --project-name=shabitools
```

---

## After Deployment:

1. **Check dashboard:** https://dash.cloudflare.com/pages/view/shabitools
2. **Set production branch:** Settings → Custom domains → Production branch = `main`
3. **Wait 2-3 minutes** for propagation
4. **Visit your site:** https://main.shabitools.pages.dev

---

## Still Having Issues?

Check the full troubleshooting guide: `CLOUDFLARE_TROUBLESHOOTING.md`
