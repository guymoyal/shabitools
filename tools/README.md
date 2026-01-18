# Tools Directory

This directory contains all individual tool implementations.

Each tool should be placed in its own folder following this structure:

```
tools/
└── [tool-name]/
    ├── page.tsx          # Tool page component
    ├── component.tsx     # Tool implementation
    ├── types.ts          # Tool-specific types
    └── README.md         # Tool documentation
```

## Adding a New Tool

1. Create a new folder in `tools/` with a descriptive name (kebab-case)
2. Implement the tool following the structure above
3. Add the tool to the navigation data in `data/tabs.json`
4. Create a route in `app/tools/[tool-name]/page.tsx` that uses your tool component
5. Add SEO metadata for the tool page
