# Logo Implementation Guide

## Logo Files Created

### Main Logo
- **File**: `/public/logo.svg`
- **Size**: 200x200px (scalable)
- **Usage**: Large displays, hero sections, about pages
- **Features**: 
  - Gradient background
  - Gear/wrench combination icon
  - Works in light and dark modes

### Simple Logo (Header/Favicon)
- **File**: `/public/logo-simple.svg`
- **Size**: 64x64px (scalable)
- **Usage**: Header navigation, small displays
- **Features**:
  - Simplified gear icon
  - Clean, minimal design
  - High contrast for visibility

### Favicon
- **File**: `/app/icon.svg`
- **Size**: 32x32px
- **Usage**: Browser tab icon, bookmarks
- **Features**:
  - Minimal gear icon
  - High contrast
  - Works at very small sizes

## Logo Design

### Concept
The logo combines:
- **Gear**: Represents tools and utilities
- **Wrench**: Represents developer tools and functionality
- **Modern Design**: Clean, professional, approachable

### Colors
- **Primary**: #0284c7 (Sky Blue)
- **Secondary**: #7c3aed (Purple) - for gradients
- **Dark Mode**: Logo inverts automatically using CSS filters

### Usage Guidelines

#### Header Logo
```tsx
<img 
  src="/logo-simple.svg" 
  alt="shabitools Logo" 
  className="h-8 w-8 dark:brightness-0 dark:invert"
/>
```

#### Large Display
```tsx
<img 
  src="/logo.svg" 
  alt="shabitools Logo" 
  className="h-32 w-32"
/>
```

#### Favicon
Next.js automatically uses `/app/icon.svg` as the favicon.

## Dark Mode Support

The logo uses CSS filters for dark mode:
- `dark:brightness-0 dark:invert` - Inverts colors for dark backgrounds
- Ensures logo is always visible regardless of theme

## Future Enhancements

### Tool Icons
Each tool should have its own icon/logo:
- **Size**: 64x64px or 128x128px
- **Style**: Match shabitools brand aesthetic
- **Format**: SVG preferred
- **Location**: `/public/tools/[tool-name].svg`

### Logo Variations
Consider creating:
- **Horizontal logo**: Logo + text side by side
- **Icon only**: For very small spaces
- **Monochrome**: For single-color printing

## Using SKILL:image-creator

To generate additional logos or tool icons:

```
SKILL:image-creator

Create a logo for shabitools website. Requirements:
- Modern, professional design
- Represents developer tools/utilities
- Works well as favicon (16x16px, 32x32px)
- Uses primary blue (#0284c7) and neutral grays
- SVG format preferred
- Transparent background
- Supports both light and dark themes
- Simple gear/wrench combination icon
- Clean, minimal, memorable
```

## Implementation Status

- ✅ Main logo created (`/public/logo.svg`)
- ✅ Simple logo created (`/public/logo-simple.svg`)
- ✅ Favicon created (`/app/icon.svg`)
- ✅ Header updated to use logo
- ✅ Dark mode support added
- ⏳ Tool icons (35+ needed)
- ⏳ Logo variations (horizontal, monochrome)

## Notes

- All logos are SVG for scalability
- Logos work in both light and dark themes
- Favicon is automatically handled by Next.js
- Logo files are optimized for web (small file sizes)
