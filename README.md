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

## Roadmap & TODO

See [TODO.md](./TODO.md) for planned tools, monetization strategy, and implementation checklist.

## Learn More

See the [documentation](./docs/README.md) for more details about the project architecture, development guidelines, and SEO strategy.

See [suggestions.md](./suggestions.md) for Cloudflare deployment best practices and optimization tips.
