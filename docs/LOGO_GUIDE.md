# Logo Generation Guide

## Using SKILL:image-creator

To generate logos for iziTools, use the image-creator skill in your prompt:

```
SKILL:image-creator

Create a logo for iziTools website. Requirements:
- Modern, professional design
- Represents developer tools/utilities concept
- Works well as favicon (16x16px, 32x32px)
- Uses primary blue (#0284c7) and neutral grays
- SVG format preferred for scalability
- Transparent background
- Supports both light and dark themes
- Simple enough to be recognizable at small sizes

Also create icons for all tools listed in data/tools.json.
Each tool icon should:
- Be 128x128px (or SVG scalable)
- Match iziTools brand style
- Represent the tool's function clearly
- Simple, flat design style
- Work in both light and dark themes
- SVG format preferred
- Transparent background
```

## Logo Specifications

### Main Logo
- **Sizes**: 200x200px (main), 400x400px (large), favicon sizes
- **Format**: SVG preferred, PNG fallback
- **Colors**: Primary blue (#0284c7), neutral grays
- **Style**: Modern, clean, professional
- **Theme**: Works on light and dark backgrounds

### Tool Icons
- **Size**: 128x128px (or SVG scalable)
- **Format**: SVG preferred
- **Style**: Flat design, minimal, consistent
- **Colors**: Match brand palette
- **Theme**: Support both themes

## File Locations

After generating logos:
1. Main logo: `/public/logo.svg` or `/public/logo.png`
2. Favicon: `/public/favicon.ico` or `/public/favicon.png`
3. Tool icons: `/public/tools/[tool-name].svg` or `/public/tools/[tool-name].png`

## Integration

Update `data/header.json` and `data/footer.json` to reference logo files.
Update `data/tools.json` image paths to point to generated icons.

## Free Tools for Logo Generation

- Hugging Face Spaces (free tier)
- Craiyon (completely free)
- Leonardo.ai (free tier)
- Bing Image Creator (free with Microsoft account)

---

**Note**: Use the image-creator skill to get detailed prompts for free AI image generators. Never expose your API keys in public tools.
