# Cloudflare Deployment Guide & Best Practices

## 📦 Required Packages

The following packages are already installed in `package.json`:

- **wrangler** - Cloudflare CLI tool for deployment

Install dependencies:
```bash
pnpm install
```

## 🚀 Deployment Scripts

The following scripts are available in `package.json`:

### Authentication
```bash
# Login to Cloudflare (opens browser)
pnpm cf:login

# Verify you're logged in
pnpm cf:whoami
```

### Deployment Commands
```bash
# Deploy to default branch
pnpm deploy

# Deploy to preview branch
pnpm deploy:preview

# Deploy to production branch
pnpm deploy:production
```

## 📋 Best Practices for Next.js on Cloudflare Pages

### 1. **Use Static Site Generation (SSG) When Possible**

For a tools website like iziTools, prioritize static generation:

**Benefits:**
- ✅ Faster page loads
- ✅ Better SEO
- ✅ Lower costs (no serverless function invocations)
- ✅ Better caching

**Implementation:**
- Use `generateStaticParams()` for dynamic routes
- Pre-render tool pages at build time
- Use `revalidate` for ISR (Incremental Static Regeneration) if needed

**Example for tool pages:**
```typescript
// app/tools/[tool-name]/page.tsx
export async function generateStaticParams() {
  const tools = await getTools();
  return tools.map((tool) => ({
    'tool-name': tool.slug,
  }));
}

export async function generateMetadata({ params }) {
  const tool = await getTool(params['tool-name']);
  return {
    title: tool.title,
    description: tool.description,
  };
}
```

### 2. **Optimize Build Output**

**Current Configuration:**
- `output: 'standalone'` - Creates optimized standalone build
- `compress: true` - Enables compression
- Image optimization enabled

**Additional Optimizations:**
```javascript
// next.config.js
const nextConfig = {
  // ... existing config
  experimental: {
    optimizeCss: true, // Optimize CSS
  },
  // Reduce bundle size
  webpack: (config) => {
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    };
    return config;
  },
}
```

### 3. **Environment Variables**

**Best Practices:**
- Store sensitive variables in Cloudflare Dashboard
- Use `.env.local` for local development
- Never commit `.env` files to git

**Setting Variables via CLI:**
```bash
# Set production variable
wrangler pages project create izitools --production

# Or set via Cloudflare Dashboard:
# Dashboard > Pages > Your Project > Settings > Environment Variables
```

**Accessing Variables:**
```typescript
// In your code
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
```

### 4. **Asset Optimization**

**Images:**
- Use Next.js `<Image>` component (already configured)
- Optimize images before upload
- Use WebP/AVIF formats
- Implement lazy loading

**Fonts:**
- Use `next/font` for automatic optimization
- Preload critical fonts
- Use `font-display: swap` for better performance

**Example:**
```typescript
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});
```

### 5. **Caching Strategy**

**Static Assets:**
- Cloudflare automatically caches static assets
- Set appropriate cache headers for dynamic content

**API Routes (if needed):**
```typescript
// app/api/route.ts
export async function GET() {
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

### 6. **Performance Optimization**

**Code Splitting:**
- Use dynamic imports for heavy components
- Lazy load tool components
- Split vendor bundles

**Example:**
```typescript
import dynamic from 'next/dynamic';

const HeavyTool = dynamic(() => import('@/tools/heavy-tool'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // If tool requires client-side only
});
```

**Bundle Analysis:**
```bash
# Add to package.json
"analyze": "ANALYZE=true pnpm build"

# Install @next/bundle-analyzer
pnpm add -D @next/bundle-analyzer
```

### 7. **SEO Optimization**

**Already Implemented:**
- ✅ Meta tags in layout
- ✅ robots.ts file
- ✅ Structured data ready

**Additional Recommendations:**
- Generate sitemap.xml dynamically
- Add Open Graph images
- Implement JSON-LD structured data for tools
- Use canonical URLs

**Sitemap Example:**
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import tools from '@/data/tools.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const toolEntries = tools.map((tool) => ({
    url: `https://izitools.com${tool.link}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: tool.featured ? 0.8 : 0.6,
  }));

  return [
    {
      url: 'https://izitools.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...toolEntries,
  ];
}
```

### 8. **Error Handling & Monitoring**

**Error Pages:**
- Create custom `error.tsx` and `not-found.tsx`
- Implement proper error boundaries

**Monitoring:**
- Use Cloudflare Analytics (built-in)
- Consider adding Sentry or similar for error tracking
- Monitor Core Web Vitals

### 9. **Security Best Practices**

**Headers:**
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

### 10. **Deployment Workflow**

**Recommended Workflow:**

1. **Development:**
   ```bash
   pnpm dev
   ```

2. **Build & Test Locally:**
   ```bash
   pnpm build
   pnpm start
   ```

3. **Deploy to Preview:**
   ```bash
   pnpm deploy:preview
   ```

4. **Test Preview Deployment**

5. **Deploy to Production:**
   ```bash
   pnpm deploy:production
   ```

**CI/CD Integration (GitHub Actions):**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main
      - preview

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: izitools
          directory: .next
```

### 11. **Domain Configuration**

**Custom Domain Setup:**
1. Go to Cloudflare Dashboard > Pages > Your Project
2. Navigate to Custom Domains
3. Add your domain
4. Update DNS records as instructed

**DNS Records:**
- CNAME: `izitools.com` → `your-project.pages.dev`
- Or use Cloudflare's automatic DNS management

### 12. **Monitoring & Analytics**

**Cloudflare Analytics:**
- Built-in analytics in Cloudflare Dashboard
- Real-time metrics
- Performance insights

**Additional Tools:**
- Google Analytics (if needed)
- Cloudflare Web Analytics (privacy-focused alternative)
- Core Web Vitals monitoring

### 13. **Cost Optimization**

**Cloudflare Pages Pricing:**
- Free tier: 500 builds/month, unlimited requests
- Paid: $20/month for more builds

**Optimization Tips:**
- Use SSG to minimize serverless function usage
- Optimize build times
- Cache static assets aggressively
- Use Cloudflare's CDN effectively

### 14. **Troubleshooting**

**Common Issues:**

1. **Build Failures:**
   ```bash
   # Check build locally first
   pnpm build
   
   # Check Cloudflare build logs
   # Dashboard > Pages > Your Project > Deployments
   ```

2. **Environment Variables Not Working:**
   - Verify variables are set in Cloudflare Dashboard
   - Check variable names match exactly
   - Restart deployment after adding variables

3. **Routes Not Working:**
   - Ensure using Next.js App Router (you are)
   - Check `next.config.js` configuration
   - Verify static export settings if using SSG

4. **Performance Issues:**
   - Check bundle size
   - Analyze with `@next/bundle-analyzer`
   - Optimize images
   - Check Core Web Vitals

## 📝 Quick Reference

### Initial Setup
```bash
# 1. Install dependencies
pnpm install

# 2. Login to Cloudflare
pnpm cf:login

# 3. Build project
pnpm build

# 4. Deploy
pnpm deploy
```

### Daily Workflow
```bash
# Make changes, test locally
pnpm dev

# Build and test
pnpm build && pnpm start

# Deploy
pnpm deploy:production
```

### Useful Commands
```bash
# Check who you're logged in as
pnpm cf:whoami

# List your Cloudflare Pages projects
wrangler pages project list

# View deployment logs
wrangler pages deployment tail
```

## 🎯 Summary

**For iziTools specifically:**

1. ✅ **Use SSG** - All tools can be pre-rendered
2. ✅ **Optimize Images** - Use Next.js Image component
3. ✅ **Code Split** - Lazy load individual tools
4. ✅ **Cache Aggressively** - Static content should be cached
5. ✅ **Monitor Performance** - Use Cloudflare Analytics
6. ✅ **SEO First** - Pre-render all tool pages
7. ✅ **Security Headers** - Add security headers
8. ✅ **Error Handling** - Custom error pages

**Recommended Architecture:**
- Static pages for landing, tool listings
- Client-side rendering for interactive tools
- API routes only if absolutely necessary (prefer client-side processing)
- Edge functions for any server-side needs (if required)

This approach will give you:
- ⚡ Fast page loads
- 💰 Low costs (mostly free tier)
- 🔍 Great SEO
- 📈 Scalability
- 🛡️ Security

---

**Last Updated**: 2024
