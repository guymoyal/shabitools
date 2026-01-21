# Task 09: CSS Minifier & Optimizer Tool

## Overview

Build a CSS minifier and optimizer that minifies CSS, removes comments, optimizes selectors, and provides before/after comparison with size savings.

## Market Research

### Why This Tool?
- **Performance Critical**: CSS minification improves load times
- **SEO Value**: "css minifier", "css compressor", "minify css", "css optimizer"
- **Developer Need**: Quick CSS optimization
- **Build Tool Alternative**: Not everyone uses build tools
- **Learning Tool**: Shows optimization techniques

### Reference Tools
- **CSS Minifier**: https://www.cssminifier.com/
- **CSS Compressor**: https://csscompressor.com/
- **Minify CSS**: https://minifycss.com/
- **Clean CSS**: https://www.cleancss.com/css-minify/

### Competitive Analysis
- Most tools are basic minifiers
- Opportunity: Better optimization
- Opportunity: Before/after comparison
- Opportunity: Optimization suggestions
- Opportunity: Multiple output formats
- Opportunity: CSS validation

## UI/UX Requirements

### Layout
- **Input Section**:
  - Large CSS editor
  - Syntax highlighting
  - Line numbers
  - File upload button
  - Paste from clipboard
  
- **Options Panel**:
  - Remove comments
  - Remove whitespace
  - Optimize selectors
  - Remove unused rules (optional)
  - Preserve important comments
  - Source map generation (optional)
  
- **Output Section**:
  - Minified CSS display
  - Before/after comparison
  - Size savings display
  - Copy minified CSS
  - Download minified CSS

### Visual Design
- **Comparison View**:
  - Side-by-side before/after
  - Highlight differences
  - Size comparison
  
- **Stats Display**:
  - Original size
  - Minified size
  - Savings percentage
  - Savings in bytes/KB
  
- **Code Display**:
  - Syntax highlighting
  - Line numbers
  - Word wrap option

### User Experience
- Real-time minification (optional)
- Before/after comparison
- Size savings prominently displayed
- Copy/download functionality
- Share minified CSS
- Dark mode support
- Mobile-friendly (basic)

## Technical Requirements

### Features to Implement

#### Core Features
1. **CSS Minification**
   - Remove whitespace
   - Remove comments (except /*! important */)
   - Remove semicolons where possible
   - Optimize color values (#fff instead of #ffffff)
   - Optimize zero values (0px → 0)
   - Remove unnecessary units (0px → 0)
   
2. **CSS Optimization**
   - Merge duplicate selectors
   - Remove empty rules
   - Optimize font-weight (bold → 700)
   - Optimize color formats
   - Remove vendor prefixes (optional)
   - Sort properties (optional)
   
3. **Before/After Comparison**
   - Side-by-side view
   - Highlight changes
   - Show size difference
   - Character/line count
   
4. **Validation**
   - CSS syntax validation
   - Show errors
   - Highlight invalid CSS
   - Suggestions for fixes

#### Advanced Features (Phase 2)
- CSS beautifier (format CSS)
- Remove unused CSS
- CSS validator
- Autoprefixer integration
- Multiple file support
- Source map generation

### Component Structure

```
components/CSSMinifier/
├── CSSMinifier.tsx              # Main component
├── CSSEditor.tsx                # CSS input editor
├── MinifyOptions.tsx            # Minification options
├── ComparisonView.tsx           # Before/after comparison
├── StatsDisplay.tsx             # Size savings display
├── ResultDisplay.tsx             # Minified output
└── index.ts
```

### Data Structure

#### Minification Result
```typescript
interface MinificationResult {
  original: string;
  minified: string;
  originalSize: number;
  minifiedSize: number;
  savings: number;
  savingsPercent: number;
  options: MinifyOptions;
}
```

#### Data Files
- `data/tools/css-minifier/overview.json`
- `data/tools/css-minifier/instructions.json`
- `data/tools/css-minifier/examples.json`

## Implementation Steps

### Phase 1: Setup
1. Create component structure
2. Create CSS editor
3. Create data files
4. Add to `data/tools.json`
5. Create route `app/tools/css-minifier/page.tsx`

### Phase 2: Core Functionality
1. Implement CSS minification algorithm
2. Build before/after comparison
3. Calculate size savings
4. Add validation
5. Display results

### Phase 3: Advanced Features
1. Add minification options
2. Implement optimization features
3. Add copy/download
4. Add share functionality
5. Error handling

### Phase 4: Polish
1. Improve minification algorithm
2. Add example CSS
3. Add optimization suggestions
4. Responsive design
5. Dark mode support

## Minification Examples

### Before
```css
/* Header Styles */
.header {
    background-color: #ffffff;
    padding: 10px 20px;
    margin: 0px;
    font-weight: bold;
}
```

### After
```css
.header{background-color:#fff;padding:10px 20px;margin:0;font-weight:700}
```

## SEO & Content

### Meta Tags
- Title: "CSS Minifier - Minify and Optimize CSS Online"
- Description: "Minify and optimize CSS code. Remove whitespace, comments, and optimize selectors. See size savings and improve performance."
- Keywords: "css minifier, css compressor, minify css, css optimizer, compress css"

### Content for overview.json
- Title: "CSS Minifier & Optimizer"
- Subtitle: "Minify and optimize CSS code"
- Description: "Minify and optimize CSS code to reduce file size and improve performance. Remove whitespace, comments, optimize selectors, and see size savings."
- Features: CSS minification, Optimization, Before/after comparison, Size savings, Validation, Export options
- Use Cases: Reducing CSS file size, Performance optimization, Production builds, Learning optimization, Quick CSS minification

## Success Criteria

- ✅ Minifies CSS correctly
- ✅ Shows accurate size savings
- ✅ Before/after comparison is clear
- ✅ Options work correctly
- ✅ Validation works
- ✅ Copy/download works
- ✅ Mobile-friendly
- ✅ Fast minification

## Reference Links

- **CSS Minifier**: https://www.cssminifier.com/
- **Clean CSS**: https://www.cleancss.com/css-minify/
- **CSS Compression**: https://csscompressor.com/
- **PostCSS**: https://postcss.org/

## Notes

- Minification algorithm is critical
- Size savings display is important
- Before/after comparison adds value
- Consider using a library (csso, clean-css)
- Validation prevents errors
- Optimization suggestions are valuable
