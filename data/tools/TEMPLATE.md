# Tool Data Template

Use this as a template when creating data files for a new tool.

## Folder Structure

Create: `data/tools/[tool-name]/`

## Required Files

### 1. overview.json

```json
{
  "title": "Tool Name",
  "subtitle": "Brief subtitle describing the tool",
  "description": "Detailed description of what the tool does and its purpose. This should be comprehensive and explain the value proposition.",
  "features": [
    {
      "title": "Feature Name 1",
      "description": "Description of what this feature does"
    },
    {
      "title": "Feature Name 2",
      "description": "Description of what this feature does"
    }
  ],
  "useCases": [
    "Use case 1 - when would someone use this",
    "Use case 2 - another scenario",
    "Use case 3 - additional use case"
  ],
  "tips": [
    "Helpful tip 1",
    "Helpful tip 2",
    "Pro tip for power users"
  ]
}
```

### 2. instructions.json

```json
{
  "steps": [
    {
      "number": 1,
      "title": "Step Title",
      "description": "Detailed description of what to do in this step"
    },
    {
      "number": 2,
      "title": "Next Step",
      "description": "Continue with next action"
    }
  ],
  "modes": {
    "mode1": {
      "title": "Mode Name",
      "description": "What this mode does and when to use it"
    }
  }
}
```

### 3. examples.json

```json
{
  "examples": [
    {
      "title": "Example Title",
      "description": "What this example demonstrates",
      "steps": [
        "Step 1 of the example",
        "Step 2 of the example",
        "Step 3 of the example"
      ]
    }
  ]
}
```

## Usage in Components

### Overview Component

Create `components/[ToolName]/Overview.tsx`:

```tsx
import overviewData from '@/data/tools/[tool-name]/overview.json';

export default function Overview() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-4 lg:px-8">
        {/* Use overviewData.title, overviewData.description, etc. */}
      </div>
    </div>
  );
}
```

### Tool Page

In `app/tools/[tool-name]/page.tsx`:

```tsx
import Overview from '@/components/[ToolName]/Overview';
import ToolComponent from '@/components/[ToolName]/[ToolName]';
import overviewData from '@/data/tools/[tool-name]/overview.json';

export const metadata: Metadata = {
  title: `${overviewData.title} - iziTools`,
  description: overviewData.description,
  // ...
};

export default function ToolPage() {
  return (
    <>
      <ToolComponent />
      <Overview />
    </>
  );
}
```

## Benefits

- ✅ Easy content editing (no code changes needed)
- ✅ Consistent structure across all tools
- ✅ SEO-friendly (use in metadata)
- ✅ Reusable content (use in docs, components, etc.)
- ✅ Version control friendly (JSON diffs are clear)
