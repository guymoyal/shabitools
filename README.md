# iziTools

A comprehensive collection of web tools for developers and general users, built with Next.js, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended package manager)

### Installation

```bash
pnpm install
```

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

Build the production version:

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

### Linting

```bash
pnpm lint
```

## Project Structure

- `app/` - Next.js app directory with pages and layouts
- `components/` - Reusable React components (Header, Hero, Tabs, FAQ, Footer, Search)
- `data/` - JSON data files for component content
  - `data/tools/` - Tool-specific content data (each tool has its own folder)
- `types/` - TypeScript type definitions
- `tools/` - Individual tool implementations (separate folder)
- `docs/` - Project documentation
  - `docs/tools/` - Individual tool documentation (MD files)
- `public/` - Static assets

## Content Management

All tool content is stored in JSON files for easy editing:

- **Main Data**: `data/header.json`, `data/hero.json`, `data/tabs.json`, etc.
- **Tool Data**: `data/tools/[tool-name]/overview.json`, `instructions.json`, `examples.json`
- **Benefits**: Non-developers can update content without touching code

## Tool Documentation

Each tool added to the tabs or menu should have a corresponding markdown file in `docs/tools/[tool-name].md` documenting:
- Tool purpose and features
- Usage instructions
- Examples
- Screenshots (if applicable)

## Tech Stack

- **Next.js 14** - React framework with SSR/SSG
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React 18** - UI library

## Deployment

### Cloudflare Pages

This project is configured for Cloudflare Pages deployment. See [suggestions.md](./suggestions.md) for detailed deployment guide and best practices.

**Quick Deploy:**
```bash
# Login to Cloudflare
pnpm cf:login

# Deploy
pnpm deploy:production
```

## Monetization

See [MONETIZATION.md](./MONETIZATION.md) for detailed step-by-step guides on:
- Buy Me a Coffee integration (5-minute setup)
- Google AdSense setup (easy ads integration)
- Carbon Ads (developer-focused alternative)

## Roadmap & TODO

See [TODO.md](./TODO.md) for planned tools, monetization strategy, and implementation checklist.

## AI Rules & Skills

This project includes AI skill definitions for specialized expertise. See [.ai-rules/README.md](./.ai-rules/README.md) for details.

**Available Skills**:
- `SKILL:developer` - Expert fullstack developer & frontend UI specialist
- `SKILL:product` - Expert product manager & research specialist
- `SKILL:image-creator` - Expert AI image and logo creator

Use these skills in prompts to activate specialized context and expertise.

## Features

- ✅ **Dark Theme**: Complete dark mode support with theme toggle
- ✅ **SEO Optimized**: Structured data schemas, meta tags, optimized content
- ✅ **Data-Driven**: All content from JSON files (easy updates)
- ✅ **Organized Tools**: Categorized by type and usage
- ✅ **Search Functionality**: Quick tool discovery
- ✅ **Responsive Design**: Mobile-first, fully responsive
- ✅ **Accessibility**: ARIA labels, keyboard navigation
- ✅ **30 Task Files**: Ready for future tool development

## Documentation

- **[Project Overview](./docs/PROJECT_OVERVIEW.md)** - Complete project architecture and structure
- **[SEO Guide](./docs/SEO_GUIDE.md)** - Comprehensive SEO strategy and implementation
- **[UX Checklist](./docs/UX_CHECKLIST.md)** - UX improvements and best practices
- **[Logo Guide](./docs/LOGO_GUIDE.md)** - How to generate logos using SKILL:image-creator
- **[Tool Documentation](./docs/tools/)** - Individual tool documentation (18 tools)
- **[Task Files](./tasks/)** - 30 detailed task specifications for new tools

## Implementation Status

✅ **All core improvements complete!**

- ✅ Header improved (shorter search, contact removed)
- ✅ Tools organized by categories and usage
- ✅ All tools have 20-40 word descriptions
- ✅ 18 tool documentation files created
- ✅ 20 additional task files created (30 total)
- ✅ SEO schemas implemented
- ✅ Dark theme system complete
- ✅ All content from JSON files
- ✅ Comprehensive documentation

**See [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) for full details.**

## Learn More

See the [documentation](./docs/README.md) for more details about the project architecture, development guidelines, and SEO strategy.

See [suggestions.md](./suggestions.md) for Cloudflare deployment best practices and optimization tips.
