# SEO Guide for iziTools

## Overview

This guide outlines the SEO strategy and implementation for iziTools to ensure maximum search engine visibility and ranking.

## SEO Implementation

### 1. Structured Data (JSON-LD)

All schemas are stored in `schemas/` folder:
- `website.json` - Website-level schema
- `organization.json` - Organization information
- `tools/tool-template.json` - Template for tool schemas

**Usage**: Schemas are added to pages via Next.js metadata API or script tags.

### 2. Page Metadata

Each page includes:
- Unique title (60 characters max)
- Meta description (150-160 characters)
- Keywords (relevant to content)
- Open Graph tags
- Twitter Card tags

### 3. Content Strategy

#### Tool Descriptions
- 20-40 words per tool
- Include primary keywords
- User-focused language
- Clear value proposition

#### Keywords
- Primary: Tool name + "tool" or "generator"
- Secondary: Related functionality keywords
- Long-tail: Specific use cases

### 4. Technical SEO

#### Performance
- Fast page load times
- Optimized images
- Code minification
- CDN delivery (Cloudflare)

#### Mobile
- Responsive design
- Touch-friendly interfaces
- Mobile-first approach

#### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Alt text for images

### 5. Internal Linking

- Tool pages link to related tools
- Category pages link to tools
- Homepage links to all categories
- Footer links to important pages

### 6. URL Structure

- Clean, descriptive URLs
- `/tools/[tool-name]` pattern
- Lowercase, hyphenated
- No unnecessary parameters

## Schema Implementation

### Website Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "iziTools",
  "url": "https://izitools.com"
}
```

### Tool Schema Template
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Tool Name",
  "applicationCategory": "DeveloperApplication",
  "offers": {
    "@type": "Offer",
    "price": "0"
  }
}
```

## Content Guidelines

### Title Tags
- Format: `[Tool Name] - [Brief Description] | iziTools`
- Max 60 characters
- Include primary keyword
- Brand name at end

### Meta Descriptions
- Format: `[Tool description with key features and benefits]`
- 150-160 characters
- Include call-to-action
- Unique per page

### Headings
- H1: Tool name (one per page)
- H2: Main sections
- H3: Subsections
- Proper hierarchy

## Monitoring & Optimization

### Key Metrics
- Organic traffic
- Keyword rankings
- Page load speed
- Mobile usability
- Core Web Vitals

### Tools
- Google Search Console
- Google Analytics
- PageSpeed Insights
- Lighthouse

## Best Practices

1. **Unique Content**: Every tool page has unique content
2. **Keyword Research**: Use tools like Google Keyword Planner
3. **Content Updates**: Regularly update tool descriptions
4. **Link Building**: Internal linking between related tools
5. **User Experience**: Fast, accessible, mobile-friendly
6. **Schema Markup**: All pages include appropriate schemas

---

**Note**: SEO is an ongoing process. Regularly monitor performance and update content based on search trends and user behavior.
