# Logo Generation Status

## Overview
Logos for iziTools website and individual tools need to be generated using `SKILL:image-creator`.

## Required Logos

### Main Website Logo
- **Location**: `/public/logo.svg` or `/public/logo.png`
- **Sizes**: 32x32px (favicon), 200x200px, 400x400px
- **Format**: SVG preferred (scalable), PNG fallback
- **Requirements**:
  - Modern, professional design
  - Represents developer tools/utilities
  - Works well as favicon
  - Uses primary blue (#0284c7) and neutral grays
  - Transparent background
  - Supports both light and dark themes

### Tool Icons (23 tools total)
Each tool needs an icon/logo:
- **Location**: `/public/tools/[tool-name].png` or `/public/tools/[tool-name].svg`
- **Sizes**: 64x64px, 128x128px
- **Format**: SVG preferred, PNG fallback
- **Requirements**:
  - Match iziTools brand style
  - Represent tool's function clearly
  - Simple, flat design
  - Work in both themes
  - Consistent visual style

## Tools Requiring Logos

1. JSON Formatter
2. Regex Tester
3. Base64 Encoder
4. API Tester
5. Visual Page Compare
6. Page Speed Compare
7. Markdown Editor
8. Code Formatter
9. CSS Minifier
10. URL Encoder
11. Hash Generator
12. UUID Generator
13. Color Contrast Checker
14. Color Picker
15. Image Compressor
16. SVG Optimizer
17. QR Code Generator
18. Password Generator
19. Text Counter
20. JWT Decoder
21. Lorem Ipsum Generator
22. Timestamp Converter
23. YAML Formatter
24. HTML Encoder

## How to Generate Logos

### Using SKILL:image-creator

**Prompt Template for Main Logo:**
```
SKILL:image-creator

Create a logo for iziTools website. Requirements:
- Modern, professional design
- Represents developer tools/utilities
- Works well as favicon (16x16px, 32x32px)
- Uses primary blue (#0284c7) and neutral grays
- SVG format preferred
- Transparent background
- Supports both light and dark themes
- Simple, memorable icon that represents "tools" or "utilities"
```

**Prompt Template for Tool Icons:**
```
SKILL:image-creator

Create an icon for [TOOL_NAME] tool. Requirements:
- 128x128px (or SVG scalable)
- Match iziTools brand style
- Represent the tool's function: [TOOL_DESCRIPTION]
- Simple, flat design
- Work in both light and dark themes
- SVG format preferred
- Transparent background
- Use primary blue (#0284c7) and neutral grays
```

## Integration Steps

1. Generate logos using SKILL:image-creator
2. Save SVG files to `/public/logo.svg` and `/public/tools/[tool-name].svg`
3. Generate PNG fallbacks if needed
4. Update `data/tools.json` to reference logo paths
5. Add favicon to `app/icon.png` or `app/favicon.ico`
6. Test logos in both light and dark themes

## Free Image Generation Options

If SKILL:image-creator requires paid services, consider:
- **Hugging Face Spaces**: Free AI image generation
- **Craiyon**: Free text-to-image
- **Leonardo.ai**: Free tier available
- **Simple Icons**: Use existing icon libraries and customize

## Notes

- All logos should be optimized for web (small file sizes)
- SVG format is preferred for scalability
- Ensure logos are accessible (good contrast)
- Test logos at various sizes
- Maintain consistent style across all logos
