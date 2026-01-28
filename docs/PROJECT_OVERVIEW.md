# shabitools - Complete Project Overview

## Project Summary

shabitools is a comprehensive web platform offering free, easy-to-use developer tools, design utilities, and general productivity tools. The project is built with Next.js 14+, TypeScript, React, and Tailwind CSS, following modern web development best practices.

## Architecture

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: React 18+
- **Styling**: Tailwind CSS 3+
- **Package Manager**: pnpm 8.15.0
- **Deployment**: Cloudflare Pages

### Project Structure
```
shabitools/
├── app/                    # Next.js app directory
│   ├── layout.tsx        # Root layout with Header/Footer
│   ├── page.tsx          # Homepage
│   ├── tools/            # Tool pages
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── Header/           # Navigation header
│   ├── Footer/           # Site footer
│   ├── Hero/             # Homepage hero section
│   ├── Tabs/             # Category tabs
│   ├── FAQ/              # FAQ section
│   ├── Search/           # Search component
│   └── [ToolName]/       # Individual tool components
├── data/                 # JSON data files
│   ├── header.json       # Header navigation
│   ├── footer.json       # Footer content
│   ├── hero.json         # Hero section content
│   ├── tabs.json         # Tool categories
│   ├── faq.json          # FAQ data
│   ├── tools.json        # All tools listing
│   └── tools/            # Tool-specific content
│       └── [tool-name]/  # Each tool's data
│           ├── overview.json
│           ├── instructions.json
│           └── examples.json
├── docs/                 # Documentation
│   ├── README.md         # Main documentation
│   └── tools/            # Tool documentation
├── schemas/              # SEO structured data
│   ├── website.json      # Website schema
│   ├── organization.json # Organization schema
│   └── tools/            # Tool schemas
├── tasks/                # Development tasks
│   └── *.md             # Task specifications
├── types/                # TypeScript types
└── .ai-rules/           # AI skill definitions
```

## Key Features

### 1. Data-Driven Architecture
- All content stored in JSON files
- Easy content updates without code changes
- Consistent data structure across tools
- SEO-friendly content management

### 2. Tool Organization
- **Categories**: Developer Tools, Design Tools, General Tools
- **Usage Ratings**: High, Medium, Low (for prioritization)
- **Featured Tools**: Highlighted on homepage
- **Search Functionality**: Quick tool discovery

### 3. SEO Optimization
- Structured data schemas (JSON-LD)
- Meta tags for each page
- Semantic HTML
- Sitemap generation
- Open Graph tags

### 4. Dark Theme Support
- System preference detection
- Manual toggle
- Persistent user preference
- Smooth transitions

### 5. Responsive Design
- Mobile-first approach
- 4px spacing system
- Consistent padding/margins
- Touch-friendly interfaces

## Content Management

### Tool Data Structure
Each tool has:
- `overview.json` - Title, description, features, use cases, tips
- `instructions.json` - Step-by-step usage instructions
- `examples.json` - Usage examples
- Entry in `tools.json` - Main listing with metadata

### Content Guidelines
- Descriptions: 20-40 words
- SEO keywords included
- Clear, concise language
- User-focused content

## Development Workflow

### Adding a New Tool
1. Create task file in `tasks/` folder
2. Create data files in `data/tools/[tool-name]/`
3. Create component in `components/[ToolName]/`
4. Create page in `app/tools/[tool-name]/page.tsx`
5. Add to `data/tools.json`
6. Update `data/tabs.json` if needed
7. Create documentation in `docs/tools/`
8. Add SEO schema in `schemas/tools/`

### Code Standards
- TypeScript strict mode
- 4px spacing increments
- Component-based architecture
- Reusable components
- Error handling
- Loading states
- Accessibility (ARIA labels)

## SEO Strategy

### On-Page SEO
- Unique titles and descriptions
- H1-H6 hierarchy
- Semantic HTML
- Alt text for images
- Internal linking

### Technical SEO
- Structured data (JSON-LD)
- Sitemap.xml
- Robots.txt
- Fast loading times
- Mobile-friendly
- HTTPS

### Content SEO
- Keyword-rich descriptions
- Tool-specific keywords
- Long-tail keywords
- User intent matching

## Deployment

### Cloudflare Pages
- Build command: `pnpm build`
- Output directory: `.next`
- Environment variables in `.env.local`
- Automatic deployments on push

### Environment Variables
- `NEXT_PUBLIC_PAGESPEED_API_KEY` - For Page Speed Compare tool
- `DEEPSEEK_API_KEY` - For text/chat (not image generation)

## Future Enhancements

### Planned Features
- User accounts (optional)
- Tool favorites/bookmarks
- Usage analytics
- Tool ratings/reviews
- Related tools suggestions
- Export/share functionality enhancements

### Additional Tools (20+ tasks ready)
- JWT Decoder
- YAML Formatter
- HTML Encoder
- JSON to CSV
- Lorem Ipsum Generator
- Timestamp Converter
- And 14+ more (see `tasks/` folder)

## Documentation

### For Developers
- `docs/README.md` - Architecture and guidelines
- `docs/tools/` - Individual tool documentation
- `tasks/` - Task specifications
- `.ai-rules/` - AI skill definitions

### For Content Editors
- `data/` - All content files
- JSON structure documentation
- Content guidelines

## Best Practices

1. **Always use JSON data** - Never hardcode content
2. **Follow 4px spacing** - Consistent design system
3. **Dark theme support** - All components should support dark mode
4. **SEO schemas** - Add schemas to all pages
5. **Error handling** - Graceful error messages
6. **Loading states** - Show progress indicators
7. **Accessibility** - ARIA labels, keyboard navigation
8. **Mobile-first** - Responsive design priority

## Support & Maintenance

- Regular content updates via JSON files
- Tool additions following established patterns
- SEO monitoring and optimization
- Performance monitoring
- User feedback integration

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Active Development
