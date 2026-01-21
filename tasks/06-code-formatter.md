# Task 06: Multi-Language Code Formatter Tool

## Overview

Build a code formatter that supports multiple programming languages (JavaScript, TypeScript, Python, HTML, CSS, JSON, etc.). Format, minify, and beautify code with language-specific options.

## Market Research

### Why This Tool?
- **Universal Need**: All developers need code formatting
- **SEO Value**: "code formatter", "javascript formatter", "python formatter", "beautify code"
- **High Search Volume**: Very popular search terms
- **Multiple Languages**: One tool for many languages is valuable
- **Daily Use**: Developers format code constantly

### Reference Tools
- **Prettier Playground**: https://prettier.io/playground/
- **CodeBeautify**: https://codebeautify.org/
- **Formatter.org**: https://www.formatter.org/
- **JS Beautifier**: https://beautifier.io/

### Competitive Analysis
- Most tools focus on one language
- Opportunity: Multi-language support
- Opportunity: Better UI/UX
- Opportunity: Side-by-side comparison
- Opportunity: Format options/config
- Opportunity: Batch formatting

## UI/UX Requirements

### Layout
- **Language Selector**:
  - Dropdown to select language
  - Supported languages: JavaScript, TypeScript, Python, HTML, CSS, JSON, YAML, XML, SQL
  
- **Input Section**:
  - Large code editor
  - Syntax highlighting
  - Line numbers
  - Language detection (optional)
  
- **Options Panel**:
  - Indent size (2, 4 spaces, tabs)
  - Line length
  - Quote style (single/double)
  - Semicolon (add/remove)
  - Trailing commas
  - Language-specific options
  
- **Output Section**:
  - Formatted code display
  - Side-by-side or tabs
  - Copy formatted code
  - Download formatted code

### Visual Design
- **Code Editor**:
  - Syntax highlighting
  - Line numbers
  - Bracket matching
  - Error highlighting
  
- **Comparison View**:
  - Before/after side-by-side
  - Highlight differences
  - Scroll synchronization
  
- **Language Badge**:
  - Show selected language
  - Language icon/color

### User Experience
- Real-time formatting (optional)
- Format on paste
- Copy formatted code
- Download as file
- Share formatted code
- Format options persistence
- Dark mode support
- Mobile-friendly (basic)

## Technical Requirements

### Features to Implement

#### Core Features
1. **Language Support**
   - JavaScript/TypeScript (using Prettier or similar)
   - Python (using Black formatter logic or similar)
   - HTML (format with indentation)
   - CSS (format with indentation)
   - JSON (already have, can reuse)
   - YAML (format with proper indentation)
   - XML (format with indentation)
   - SQL (basic formatting)
   
2. **Formatting Options**
   - Indent size (2, 4 spaces, tabs)
   - Line length
   - Quote style
   - Semicolon handling
   - Trailing commas
   - Language-specific options
   
3. **Code Editor**
   - Syntax highlighting (Monaco Editor)
   - Line numbers
   - Bracket matching
   - Auto-indentation
   
4. **Output Features**
   - Formatted code display
   - Copy to clipboard
   - Download as file
   - Share via URL
   - Before/after comparison

#### Advanced Features (Phase 2)
- Minify code (for supported languages)
- Lint code (show errors/warnings)
- Code validation
- Multiple file support
- Format on save simulation
- Custom formatter config

### Component Structure

```
components/CodeFormatter/
├── CodeFormatter.tsx            # Main component
├── LanguageSelector.tsx         # Language dropdown
├── CodeEditor.tsx               # Input editor
├── FormatOptions.tsx             # Formatting options panel
├── FormattedOutput.tsx          # Output display
├── ComparisonView.tsx           # Before/after comparison
└── index.ts
```

### Data Structure

#### Format Options
```typescript
interface FormatOptions {
  language: string;
  indentSize: number;
  useTabs: boolean;
  lineLength: number;
  quoteStyle: 'single' | 'double';
  semicolons: boolean;
  trailingCommas: boolean;
  languageSpecific?: Record<string, any>;
}
```

#### Data Files
- `data/tools/code-formatter/overview.json`
- `data/tools/code-formatter/instructions.json`
- `data/tools/code-formatter/examples.json`

## Implementation Steps

### Phase 1: Setup
1. Create component structure
2. Integrate Monaco Editor or CodeMirror
3. Create data files
4. Add to `data/tools.json`
5. Create route `app/tools/code-formatter/page.tsx`

### Phase 2: Core Functionality
1. Implement language selector
2. Build formatters for each language
3. Create code editor
4. Add format button
5. Display formatted output

### Phase 3: Advanced Features
1. Add formatting options
2. Implement before/after comparison
3. Add copy/download
4. Add share functionality
5. Language-specific options

### Phase 4: Polish
1. Improve syntax highlighting
2. Add example code for each language
3. Add error handling
4. Responsive design
5. Dark mode support

## Language-Specific Notes

### JavaScript/TypeScript
- Use Prettier logic or similar
- Options: semicolons, quotes, trailing commas
- Support JSX/TSX

### Python
- Follow PEP 8 style guide
- Indentation is critical
- Line length (79 or 88 chars)

### HTML
- Proper indentation
- Self-closing tags
- Attribute formatting

### CSS
- Property sorting (optional)
- Indentation
- Selector formatting

## SEO & Content

### Meta Tags
- Title: "Code Formatter - Format Code in Multiple Languages"
- Description: "Format and beautify code in JavaScript, Python, HTML, CSS, and more. Customizable formatting options for clean, readable code."
- Keywords: "code formatter, javascript formatter, python formatter, code beautifier, format code"

### Content for overview.json
- Title: "Code Formatter"
- Subtitle: "Format code in multiple languages"
- Description: "Multi-language code formatter supporting JavaScript, TypeScript, Python, HTML, CSS, JSON, YAML, and more. Customizable formatting options for clean, readable code."
- Features: Multi-language support, Customizable options, Syntax highlighting, Before/after comparison, Copy/download, Share functionality
- Use Cases: Formatting code, Code cleanup, Learning code style, Preparing code for review, Standardizing code format

## Success Criteria

- ✅ Formats code correctly for each language
- ✅ Syntax highlighting works
- ✅ Formatting options work
- ✅ Before/after comparison is clear
- ✅ Copy/download works
- ✅ Handles errors gracefully
- ✅ Mobile-friendly (basic)
- ✅ Fast formatting

## Reference Links

- **Prettier**: https://prettier.io/
- **CodeBeautify**: https://codebeautify.org/
- **Monaco Editor**: https://microsoft.github.io/monaco-editor/
- **PEP 8**: https://pep8.org/ (Python style guide)

## Notes

- Consider using Prettier for JavaScript/TypeScript
- Python formatting is complex (consider basic formatting)
- Monaco Editor provides good syntax highlighting
- Formatting options should be language-specific
- Error handling is important
- Consider adding code validation
