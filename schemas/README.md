# SEO Schema Markup

This folder contains JSON-LD structured data schemas for SEO optimization. These schemas help search engines understand the content and structure of iziTools.

## Schema Files

### Core Schemas
- `website.json` - Website-level schema with search functionality
- `organization.json` - Organization information
- `breadcrumb.json` - Breadcrumb navigation (if needed)

### Tool Schemas
- `tools/tool-template.json` - Template for individual tool schemas
- Individual tool schemas should be created in `tools/` folder

## Usage

Schemas should be included in page metadata using Next.js metadata API or added as JSON-LD scripts in page components.

## Schema Types Used

- **WebSite**: Main website schema
- **Organization**: Company/organization information
- **SoftwareApplication**: Individual tool schemas
- **BreadcrumbList**: Navigation breadcrumbs
- **WebPage**: Individual page schemas

## Implementation

Add schemas to pages using:
```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  // ... other metadata
  other: {
    'application/ld+json': JSON.stringify(schemaData)
  }
}
```

Or add as script tag:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
/>
```
