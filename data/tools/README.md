# Tool Data Structure

This directory contains tool-specific data files. Each tool should have its own folder with JSON files for content management.

## Structure

```
data/
├── tools/
│   ├── visual-diff/
│   │   ├── overview.json      # Tool overview, features, use cases
│   │   ├── instructions.json  # Step-by-step instructions
│   │   └── examples.json      # Usage examples
│   ├── [tool-name]/
│   │   ├── overview.json
│   │   ├── instructions.json
│   │   └── examples.json
│   └── README.md              # This file
├── header.json                # Header navigation data
├── hero.json                  # Hero section content
├── tabs.json                  # Tabs content
├── faq.json                   # FAQ data
├── footer.json                # Footer data
└── tools.json                 # Main tools listing
```

## File Formats

### overview.json

Contains tool overview, features, and use cases:

```json
{
  "title": "Tool Name",
  "subtitle": "Brief subtitle",
  "description": "Detailed description of what the tool does",
  "features": [
    {
      "title": "Feature Name",
      "description": "Feature description"
    }
  ],
  "useCases": [
    "Use case 1",
    "Use case 2"
  ],
  "tips": [
    "Tip 1",
    "Tip 2"
  ]
}
```

### instructions.json

Contains step-by-step instructions:

```json
{
  "steps": [
    {
      "number": 1,
      "title": "Step Title",
      "description": "Step description"
    }
  ],
  "overlayModes": {
    "mode1": {
      "title": "Mode Title",
      "description": "Mode description"
    }
  }
}
```

### examples.json

Contains usage examples:

```json
{
  "examples": [
    {
      "title": "Example Title",
      "description": "Example description",
      "steps": [
        "Step 1",
        "Step 2"
      ]
    }
  ]
}
```

## Adding Content for a New Tool

1. Create folder: `data/tools/[tool-name]/`
2. Create `overview.json` with tool overview
3. Create `instructions.json` with usage instructions
4. Create `examples.json` with examples
5. Create Overview component in `components/[ToolName]/Overview.tsx`
6. Import and use in tool page

## Benefits

- **Easy Content Management**: Edit JSON files instead of code
- **Consistent Structure**: All tools follow the same pattern
- **SEO Friendly**: Content can be used for meta tags and descriptions
- **Maintainable**: Non-developers can update content
- **Reusable**: Content can be used in multiple places (page, docs, etc.)
