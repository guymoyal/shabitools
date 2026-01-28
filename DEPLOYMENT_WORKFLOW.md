# Deployment Workflow for shabitools

## How Cloudflare Pages Works

### Branch-Based Deployments

Cloudflare Pages automatically creates URLs for each branch:

- **`main` branch** → `https://main.shabitools.pages.dev` (Production)
- **`preview` branch** → `https://preview.shabitools.pages.dev` (Preview)
- **Other branches** → `https://[branch-name].shabitools.pages.dev`

### Production Branch

The **`main` branch** is your production branch. When you deploy to `main`:
- ✅ Updates `https://main.shabitools.pages.dev`
- ✅ Updates `https://shabitools.pages.dev` (project alias)
- ✅ Updates `https://shabitools.com` (custom domain)

---

## Deployment Commands

### Deploy to Production (main branch)

```bash
# Method 1: Using npm script (RECOMMENDED)
pnpm deploy:production

# Method 2: Using default deploy script
pnpm deploy

# Method 3: Manual deployment
pnpm build
wrangler pages deploy out --branch main --project-name=shabitools
```

**What happens:**
1. Builds your site (`pnpm build`)
2. Deploys to `main` branch
3. Cloudflare Pages automatically updates:
   - `https://main.shabitools.pages.dev`
   - `https://shabitools.pages.dev`
   - `https://shabitools.com` (your custom domain)

### Deploy to Preview (preview branch)

```bash
pnpm deploy:preview
```

**What happens:**
1. Builds your site
2. Deploys to `preview` branch
3. Creates/updates: `https://preview.shabitools.pages.dev`
4. **Does NOT affect production** (`main` branch stays unchanged)

---

## Important Notes

### ⚠️ Branch Name: `main` NOT `master`

Cloudflare Pages uses `main` as the default production branch name.

**If your Git branch is called `master`:**
- You can either:
  1. **Rename your branch:** `git branch -m master main`
  2. **Deploy explicitly:** `wrangler pages deploy out --branch master --project-name=shabitools`
  3. **Set production branch to `master`** in Cloudflare dashboard

**But it's recommended to use `main`** as it's the modern standard.

### ✅ Automatic Updates

**Yes!** Every time you deploy to `main` branch:
- ✅ Production site (`shabitools.com`) updates automatically
- ✅ No manual steps needed
- ✅ Takes 1-2 minutes to propagate

### 🔄 Deployment Process

1. **Run:** `pnpm deploy:production`
2. **Wait:** Build completes (~30 seconds)
3. **Wait:** Upload completes (~10 seconds)
4. **Wait:** Cloudflare propagates (~1-2 minutes)
5. **Done:** Your site is live!

---

## Workflow Examples

### Example 1: Regular Production Update

```bash
# Make changes to your code
# ... edit files ...

# Deploy to production
pnpm deploy:production

# Wait 2-3 minutes
# Visit https://shabitools.com - changes are live!
```

### Example 2: Test Before Production

```bash
# Deploy to preview first
pnpm deploy:preview

# Test on: https://preview.shabitools.pages.dev
# If everything looks good, deploy to production
pnpm deploy:production
```

### Example 3: Multiple Environments

```bash
# Development branch
wrangler pages deploy out --branch dev --project-name=shabitools
# → https://dev.shabitools.pages.dev

# Staging branch
wrangler pages deploy out --branch staging --project-name=shabitools
# → https://staging.shabitools.pages.dev

# Production branch
pnpm deploy:production
# → https://shabitools.com
```

---

## Checking Deployment Status

### Via Dashboard

👉 **https://dash.cloudflare.com/pages/view/shabitools**

1. Click **"Deployments"** tab
2. See all deployments with:
   - Branch name
   - Status (Success/Failed)
   - Deployment time
   - Production indicator

### Via CLI

```bash
# List all deployments
wrangler pages deployment list --project-name=shabitools

# Check project info
wrangler pages project list
```

---

## Best Practices

### ✅ Do:

1. **Test locally first:** `pnpm build` and check `out/` directory
2. **Use preview for testing:** Deploy to `preview` branch before production
3. **Deploy to `main` for production:** Always use `main` branch for live site
4. **Wait for propagation:** Give it 2-3 minutes after deployment
5. **Check deployment status:** Verify success in dashboard

### ❌ Don't:

1. **Don't deploy broken builds:** Always test locally first
2. **Don't deploy to `main` without testing:** Use preview branch first
3. **Don't skip the build step:** Always run `pnpm build` before deploy
4. **Don't panic if it takes time:** Propagation can take 2-3 minutes

---

## Troubleshooting

### Deployment Not Updating?

1. **Check branch:** Make sure you deployed to `main` branch
2. **Check status:** Verify deployment shows "Success" in dashboard
3. **Wait longer:** Sometimes takes 3-5 minutes
4. **Clear cache:** Hard refresh browser (`Cmd+Shift+R`)
5. **Check production branch:** Verify it's set to `main` in settings

### Wrong Branch Deployed?

**If you accidentally deployed to wrong branch:**

1. **Redeploy to correct branch:**
   ```bash
   pnpm deploy:production  # Deploys to main
   ```

2. **Or set production branch in dashboard:**
   - Go to: https://dash.cloudflare.com/pages/view/shabitools/settings
   - Set production branch to the branch you want

---

## Summary

### ✅ Yes, deploying to `main` branch updates production automatically!

**Every time you run:**
```bash
pnpm deploy:production
```

**Your production site updates:**
- ✅ `https://shabitools.com`
- ✅ `https://shabitools.pages.dev`
- ✅ `https://main.shabitools.pages.dev`

**No manual steps needed!** Just deploy and wait 2-3 minutes. 🚀
