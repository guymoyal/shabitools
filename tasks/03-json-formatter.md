# Task 03: JSON Formatter & Validator Tool

## Overview

Build a comprehensive JSON formatter, validator, minifier, and editor with syntax highlighting, error detection, and multiple export formats. Essential tool for developers working with JSON data.

## Market Research

### Why This Tool?
- **Critical Need**: JSON is used everywhere in web development
- **SEO Value**: "json formatter", "json validator", "json beautifier", "format json"
- **High Search Volume**: One of the most searched developer tools
- **Daily Use**: Developers use JSON formatters multiple times per day
- **Multiple Use Cases**: Formatting, validation, minification, conversion

### Reference Tools
- **JSONLint**: https://jsonlint.com/
- **JSON Formatter**: https://jsonformatter.org/
- **JSON Crack**: https://jsoncrack.com/ (visualization)
- **JSON Editor Online**: https://jsoneditoronline.org/

### Competitive Analysis
- Most tools are basic formatters
- Opportunity: Better error messages and highlighting
- Opportunity: Multiple export formats
- Opportunity: JSON to other formats (CSV, YAML, etc.)
- Opportunity: Visual JSON tree view
- Opportunity: Compare two JSON files

## UI/UX Requirements

### Layout
- **Input Section**:
  - Large textarea/editor for JSON input
  - Syntax highlighting
  - Line numbers
  - Character/line counter
  - File upload button
  - Paste from clipboard button
  
- **Toolbar**:
  - Format/Beautify button
  - Minify button
  - Validate button
  - Clear button
  - Copy button
  - Download button
  
- **Output Section**:
  - Formatted JSON display
  - Error messages (if invalid)
  - Validation status
  - Tree view toggle

### Visual Design
- **Editor**:
  - Syntax highlighting (keys, strings, numbers, booleans, null)
  - Error highlighting (red underline for errors)
  - Line numbers
  - Bracket matching
  - Auto-indentation
  
- **Error Display**:
  - Clear error messages
  - Line number where error occurs
  - Suggestions for fixing errors
  - Color-coded severity
  
- **Tree View**:
  - Collapsible tree structure
  - Type indicators (string, number, object, array)
  - Search/filter functionality
  - Expand/collapse all

### User Experience
- Real-time validation
- Auto-format on paste
- Keyboard shortcuts (Ctrl+Enter to format)
- Undo/redo support
- Multiple themes (light/dark)
- Responsive design
- Mobile-friendly (with limitations)

## Technical Requirements

### Features to Implement

#### Core Features
1. **JSON Formatting**
   - Pretty print with indentation
   - Configurable indent size (2 or 4 spaces)
   - Preserve or remove trailing commas
   - Sort keys alphabetically (optional)
   
2. **JSON Validation**
   - Real-time validation
   - Clear error messages
   - Line number indication
   - Syntax error detection
   - Type validation
   
3. **JSON Minification**
   - Remove whitespace
   - Remove comments (if supported)
   - Optimize structure
   
4. **Error Handling**
   - Invalid JSON detection
   - Helpful error messages
   - Suggestions for common errors
   - Error highlighting in editor
   
5. **Export Options**
   - Copy formatted JSON
   - Download as .json file
   - Export as formatted text
   - Share via URL (encode in URL)

#### Advanced Features (Phase 2)
- JSON to CSV conversion
- JSON to YAML conversion
- JSON to XML conversion
- Compare two JSON files
- JSON schema validation
- JSON path extraction
- Visual tree view with search
- History of recent JSONs

### Component Structure

```
components/JSONFormatter/
├── JSONFormatter.tsx           # Main component
├── JSONEditor.tsx              # Code editor with syntax highlighting
├── Toolbar.tsx                 # Format/Validate/Minify buttons
├── ErrorDisplay.tsx            # Error messages
├── TreeView.tsx                # Visual tree view
├── ExportOptions.tsx           # Copy/Download/Share
└── index.ts
```

### Data Structure

#### JSON Validation Result
```typescript
interface ValidationResult {
  valid: boolean;
  error?: {
    message: string;
    line: number;
    column: number;
    suggestion?: string;
  };
  formatted?: string;
  minified?: string;
}
```

#### Data Files
- `data/tools/json-formatter/overview.json`
- `data/tools/json-formatter/instructions.json`
- `data/tools/json-formatter/examples.json`

## Implementation Steps

### Phase 1: Setup
1. Create component structure
2. Choose/implement code editor (Monaco Editor or CodeMirror)
3. Create data files
4. Add to `data/tools.json`
5. Create route `app/tools/json-formatter/page.tsx`

### Phase 2: Core Functionality
1. Implement JSON editor with syntax highlighting
2. Build format/beautify function
3. Build minify function
4. Implement validation
5. Add error display

### Phase 3: Advanced Features
1. Add tree view
2. Implement export options
3. Add file upload
4. Add copy to clipboard
5. Add shareable URLs

### Phase 4: Polish
1. Add keyboard shortcuts
2. Improve error messages
3. Add example JSONs
4. Responsive design
5. Dark mode support

## Example JSONs for Testing

### Simple Object
```json
{"name":"John","age":30,"city":"New York"}
```

### Nested Structure
```json
{
  "users": [
    {"id": 1, "name": "Alice", "email": "alice@example.com"},
    {"id": 2, "name": "Bob", "email": "bob@example.com"}
  ],
  "metadata": {
    "total": 2,
    "page": 1
  }
}
```

### Invalid JSON (for error testing)
```json
{
  "name": "John"
  "age": 30
}
```

## SEO & Content

### Meta Tags
- Title: "JSON Formatter & Validator - Format, Validate, Minify JSON"
- Description: "Format, validate, and minify JSON online. Beautiful JSON editor with syntax highlighting, error detection, and multiple export options."
- Keywords: "json formatter, json validator, json beautifier, format json, json minifier"

### Content for overview.json
- Title: "JSON Formatter & Validator"
- Subtitle: "Format, validate, and minify JSON data"
- Description: "Comprehensive JSON tool for formatting, validating, and minifying JSON data. Features syntax highlighting, error detection, tree view, and multiple export options."
- Features: JSON formatting, Real-time validation, Minification, Syntax highlighting, Error detection, Tree view, Export options
- Use Cases: Formatting API responses, Validating JSON data, Minifying JSON files, Debugging JSON errors, Learning JSON structure

## Success Criteria

- ✅ Formats JSON correctly with proper indentation
- ✅ Validates JSON and shows clear errors
- ✅ Minifies JSON properly
- ✅ Syntax highlighting works
- ✅ Error messages are helpful
- ✅ Copy/download works
- ✅ Tree view is functional
- ✅ Mobile-friendly (basic functionality)

## Reference Links

- **JSONLint**: https://jsonlint.com/
- **JSON Formatter**: https://jsonformatter.org/
- **JSON Crack**: https://jsoncrack.com/
- **Monaco Editor**: https://microsoft.github.io/monaco-editor/
- **JSON Spec**: https://www.json.org/json-en.html

## Notes

- Consider Monaco Editor for syntax highlighting
- Error messages should be developer-friendly
- Tree view is a nice differentiator
- File upload is important feature
- Consider JSON5 support (comments, trailing commas)
