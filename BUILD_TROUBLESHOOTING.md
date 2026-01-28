# Build Troubleshooting Guide

## Common Build Issues and Solutions

### Issue 1: Google Fonts Network Error

**Error**: `Failed to fetch Inter from Google Fonts`

**Solution**: ✅ Fixed - Switched to system font stack
- Removed `next/font/google` dependency
- Using system fonts via Tailwind CSS
- No network required during build

### Issue 2: .env File Permission Error

**Error**: `EPERM: operation not permitted, open '.env'`

**Solution**: 
- The `.env` file is optional and not required for build
- If you see this error, it's usually a permission issue
- You can safely ignore it if you don't need environment variables
- To fix: Ensure `.env` file has correct permissions or delete it if not needed

### Issue 3: File Permission Errors in node_modules

**Error**: `Operation not permitted` when reading node_modules

**Solution**:
1. Clean and reinstall dependencies:
   ```bash
   rm -rf node_modules .next out
   pnpm install
   ```

2. Check file permissions:
   ```bash
   ls -la node_modules/.pnpm
   ```

3. If on macOS, check if files are locked by another process

### Issue 4: Build Fails with TypeScript Errors

**Solution**: 
- Fix TypeScript errors first: `pnpm lint`
- Or temporarily enable `ignoreBuildErrors` in `next.config.js` (not recommended)

### Issue 5: Build Fails with ESLint Errors

**Solution**:
- Fix ESLint errors: `pnpm lint`
- Or temporarily enable `ignoreDuringBuilds` in `next.config.js` (not recommended)

## Clean Build Process

If you encounter persistent issues, try a clean build:

```bash
# 1. Clean all build artifacts
rm -rf .next out node_modules

# 2. Clear pnpm cache (optional)
pnpm store prune

# 3. Reinstall dependencies
pnpm install

# 4. Build
pnpm build
```

## Network Requirements

For static export builds:
- ✅ No network required (all fonts are system fonts)
- ✅ No external API calls during build
- ✅ All assets are bundled locally

## Verification

After successful build, verify:

```bash
# Check if out directory exists
ls -la out/

# Check if index.html exists
ls -la out/index.html

# Check if static assets are present
ls -la out/_next/static/
```

## Still Having Issues?

1. Check Node.js version: `node --version` (should be 18+)
2. Check pnpm version: `pnpm --version` (should be 8.15.0)
3. Check available disk space
4. Check system permissions
5. Try building in a fresh directory
