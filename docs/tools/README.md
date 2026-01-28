# Tool Documentation

This directory contains markdown documentation files for each tool in the shabitools platform.

## Documentation Structure

Each tool should have a corresponding markdown file named `[tool-name].md` that includes:

### Required Sections

1. **Tool Title** - Clear, descriptive title
2. **Overview** - Brief description of what the tool does
3. **Features** - List of key features and capabilities
4. **How to Use** - Step-by-step usage instructions
5. **Examples** - Practical examples showing the tool in action

### Optional Sections

- **Use Cases** - Common scenarios where the tool is useful
- **Tips & Tricks** - Helpful tips for getting the most out of the tool
- **Limitations** - Known limitations or constraints
- **Related Tools** - Links to related tools on the platform

## Example Template

```markdown
# Tool Name

## Overview
Brief description of the tool and its purpose.

## Features
- Feature 1
- Feature 2
- Feature 3

## How to Use
Step-by-step instructions...

## Examples
### Example 1
Description and example...

## Use Cases
- Use case 1
- Use case 2
```

## Adding Documentation

When adding a new tool:

1. **Create Data Files**: Create `data/tools/[tool-name]/` folder with JSON files:
   - `overview.json` - Tool overview, features, use cases
   - `instructions.json` - Step-by-step instructions
   - `examples.json` - Usage examples
2. **Create Overview Component**: Build `components/[ToolName]/Overview.tsx` that displays content from JSON files
3. **Create Tool Page**: In `app/tools/[tool-name]/page.tsx`, place the tool component first, then the overview component below it
4. **Create Documentation**: Create markdown file: `docs/tools/[tool-name].md`
5. **Follow Structure**: Use the structure above for the MD file
6. **Link Documentation**: Link to the documentation from the tool's page component
7. **Update README**: Update this README if adding new documentation patterns

**Note**: The overview/content section should appear BELOW the tool interface, not above it. Users should see the tool immediately when they land on the page.

## Data-Driven Content

All tool content should be stored in JSON files in `data/tools/[tool-name]/`:

- **overview.json**: Used by Overview component and for SEO metadata
- **instructions.json**: Can be used to generate help sections
- **examples.json**: Can be used to generate example sections

This allows non-developers to update content without touching code.
