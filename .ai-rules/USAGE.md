# How to Use Skills in Cursor

## Usage Examples

### Example 1: Developer Skill

**Prompt:**
```
SKILL:developer

Create a new JSON formatter tool component. It should:
- Accept JSON input in a textarea
- Validate and format the JSON
- Show syntax errors if invalid
- Use proper TypeScript types
- Follow the 4px spacing system
- Be fully responsive
```

### Example 2: Product Skill

**Prompt:**
```
SKILL:product

Research and recommend 5 new developer tools we should add to shabitools.
Consider:
- Market demand and search volume
- Ease of implementation
- SEO potential
- User value
```

### Example 3: Image Creator Skill

**Prompt:**
```
SKILL:image-creator

Create a logo for shabitools website. Requirements:
- Modern, professional design
- Represents developer tools/utilities
- Works well as favicon (small size)
- Uses primary blue (#0284c7) and neutral grays
- SVG format preferred
- Transparent background

Also create icons for:
1. JSON Formatter tool
2. Regex Tester tool
3. Base64 Encoder tool

All icons should match the shabitools brand style.
```

### Example 4: Combined Skills

**Prompt:**
```
SKILL:developer SKILL:product

Design and implement a new "Code Formatter" tool. Include:
- Market research showing demand
- Technical implementation plan
- UI/UX considerations
- SEO optimization strategy
```

### Example 5: Image Creator for Tool Icons

**Prompt:**
```
SKILL:image-creator

Generate icons for these shabitools:
1. Page Speed Compare - represents performance/analytics
2. Color Contrast Checker - represents accessibility/colors
3. QR Code Generator - represents QR codes/barcodes
4. Markdown Editor - represents text/markdown editing
5. CSS Minifier - represents optimization/compression

Style: Flat design, minimal, professional
Colors: Match shabitools brand (#0284c7 primary blue)
Size: 128x128px each
Format: SVG preferred, PNG fallback
Background: Transparent
```

## Best Practices

1. **Be Specific**: Include detailed requirements in your prompt
2. **Use Skills Early**: Place skill tags at the beginning of your prompt
3. **Combine When Needed**: Use multiple skills for complex tasks
4. **Provide Context**: Include project-specific details
5. **Iterate**: Refine prompts based on results

## Image Generation Options

When using `SKILL:image-creator`, you can use:

### Free Options (No API Key)
- Hugging Face Spaces (free tier)
- Craiyon (completely free)
- Leonardo.ai (free tier with limits)
- Bing Image Creator (free with Microsoft account)

### Paid Options (Your Own API Key)
- OpenAI DALL-E 3
- Midjourney
- Stability AI
- DeepInfra (Janus-Pro)

**Important**: Never expose your API keys in public tools. If building an image generation tool for users, they should provide their own API keys.
