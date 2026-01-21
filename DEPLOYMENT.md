# Deployment Guide for iziTools

## Overview

This guide explains how to build and deploy iziTools to Cloudflare Pages as a Static Site Generation (SSG) site.

## Prerequisites

Before deploying, you need:

1. **Cloudflare Account** - Sign up at [cloudflare.com](https://cloudflare.com)
2. **Cloudflare Pages Project** - Create a new Pages project in your Cloudflare dashboard
3. **Wrangler CLI** - Already included in devDependencies

## Configuration

### Current Setup

- ✅ **SSG Mode**: Configured with `output: 'export'` in `next.config.js`
- ✅ **Robots**: All pages disallowed (noindex) - ready to enable indexing later
- ✅ **Build Output**: Static files generated in `out/` directory
- ✅ **Deployment Script**: Ready-to-use deployment scripts

## What You Need to Supply

### 1. Cloudflare Account Credentials

You'll need to authenticate with Cloudflare:

```bash
# Login to Cloudflare (opens browser)
pnpm cf:login

# Verify authentication
pnpm cf:whoami
```

### 2. Cloudflare Pages Project Details

After creating a Pages project in Cloudflare dashboard, you'll need:

- **Project Name**: Your project name (e.g., "izitools")
- **Account ID**: Found in Cloudflare dashboard URL or via API
- **Pages Project Name**: The name you gave your Pages project

**Note**: The `wrangler.toml` file is already configured, but you may need to update the project name if it differs.

### 3. Environment Variables (Optional)

If you need environment variables:

1. Set them in Cloudflare Pages dashboard: **Settings → Environment Variables**
2. Or add to `wrangler.toml`:
```toml
[vars]
NODE_ENV = "production"
```

## Building the Site

### Local Build

```bash
# Install dependencies
pnpm install

# Build the site (creates 'out' directory)
pnpm build
```

The build will:
- Generate static HTML files in `out/` directory
- Optimize assets
- Create all pages as static files

### Verify Build

After building, check the `out/` directory:

```bash
ls -la out/
```

You should see:
- `index.html` (homepage)
- `tools/` (tool pages)
- `_next/` (Next.js assets)
- Other static pages

## Deployment Methods

### Method 1: Using npm/pnpm Scripts (Recommended)

```bash
# Deploy to production (main branch)
pnpm deploy:production

# Deploy to preview branch
pnpm deploy:preview

# Deploy to default branch
pnpm deploy
```

### Method 2: Using Deployment Script

Make the script executable:

```bash
chmod +x scripts/deploy.sh
```

Then run:

```bash
# Deploy to production
./scripts/deploy.sh production

# Deploy to preview
./scripts/deploy.sh preview

# Deploy to custom branch
./scripts/deploy.sh your-branch-name
```

### Method 3: Manual Deployment

```bash
# Build
pnpm build

# Deploy
wrangler pages deploy out --branch main
```

## Cloudflare Pages Dashboard Setup

### Initial Setup

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages**
3. Click **Create Application** → **Pages** → **Connect to Git**
4. Connect your Git repository (GitHub, GitLab, etc.)
5. Configure build settings:
   - **Build command**: `pnpm build`
   - **Build output directory**: `out`
   - **Root directory**: `/` (or your project root)

### Manual Deployment via Dashboard

1. Go to your Pages project
2. Click **Upload assets**
3. Upload the `out/` directory contents
4. Deploy

## Post-Deployment

### Verify Deployment

1. Check your Cloudflare Pages URL (provided after deployment)
2. Verify all pages load correctly
3. Check robots.txt: `https://your-domain.com/robots.txt`
4. Verify noindex meta tags in page source

### Enable Indexing Later

When ready to allow search engines:

1. Update `app/robots.ts`:
```typescript
return {
  rules: [
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
  ],
  sitemap: `${baseUrl}/sitemap.xml`,
};
```

2. Update `app/layout.tsx` metadata:
```typescript
robots: {
  index: true,
  follow: true,
  // ... other settings
}
```

3. Rebuild and redeploy

## Troubleshooting

### Build Fails

- Check Node.js version (requires 18+)
- Run `pnpm install` to ensure dependencies are installed
- Check for TypeScript errors: `pnpm lint`

### Deployment Fails

- Verify Cloudflare authentication: `pnpm cf:whoami`
- Check `wrangler.toml` configuration
- Ensure `out/` directory exists after build

### Pages Not Loading

- Verify build output directory is `out`
- Check Cloudflare Pages build logs
- Ensure all static assets are in `out/` directory

### Images Not Loading

- Next.js Image component requires `unoptimized: true` for static export
- Use regular `<img>` tags or ensure images are in `public/` directory

## Build Output Structure

```
out/
├── index.html
├── tools/
│   ├── json-formatter/
│   │   └── index.html
│   └── ...
├── privacy/
│   └── index.html
├── terms/
│   └── index.html
├── about/
│   └── index.html
├── contact/
│   └── index.html
├── blog/
│   └── index.html
├── _next/
│   ├── static/
│   └── ...
├── robots.txt
├── sitemap.xml
└── ...
```

## Quick Reference

```bash
# Install dependencies
pnpm install

# Build site
pnpm build

# Login to Cloudflare
pnpm cf:login

# Deploy to production
pnpm deploy:production

# Deploy to preview
pnpm deploy:preview
```

## Support

For issues or questions:
- Check Cloudflare Pages documentation
- Review build logs in Cloudflare dashboard
- Check Next.js static export documentation
