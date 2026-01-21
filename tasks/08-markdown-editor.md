# Task 08: Markdown Editor with Live Preview Tool

## Overview

Build a live Markdown editor with split-pane preview, syntax highlighting, toolbar with common formatting buttons, and export options. Helps developers write and preview Markdown in real-time.

## Market Research

### Why This Tool?
- **Growing Popularity**: Markdown is everywhere (GitHub, docs, blogs)
- **SEO Value**: "markdown editor", "markdown preview", "markdown online", "live markdown"
- **Developer Need**: Quick way to write/preview Markdown
- **Educational**: Helps users learn Markdown syntax
- **Multiple Use Cases**: Documentation, README files, blog posts

### Reference Tools
- **StackEdit**: https://stackedit.io/
- **Dillinger**: https://dillinger.io/
- **Markdown Live Preview**: https://markdownlivepreview.com/
- **HackMD**: https://hackmd.io/

### Competitive Analysis
- Most tools are full-featured editors (can be overwhelming)
- Opportunity: Simpler, focused tool
- Opportunity: Better mobile experience
- Opportunity: Export options
- Opportunity: Template library
- Opportunity: Markdown cheat sheet

## UI/UX Requirements

### Layout
- **Editor Section** (Left):
  - Markdown text editor
  - Syntax highlighting
  - Line numbers
  - Toolbar with formatting buttons
  
- **Preview Section** (Right):
  - Live rendered HTML preview
  - Scroll synchronization
  - Toggle fullscreen
  - Export options
  
- **Toolbar**:
  - Bold, Italic, Heading buttons
  - Link, Image buttons
  - Code block, List buttons
  - Table button
  - Clear, Copy buttons

### Visual Design
- **Split View**:
  - Resizable split pane
  - Toggle editor/preview
  - Fullscreen mode
  - Mobile: Stack vertically
  
- **Syntax Highlighting**:
  - Markdown syntax colors
  - Headers, links, code blocks
  - Lists, tables
  
- **Preview Styling**:
  - Clean, readable HTML
  - GitHub-style (optional)
  - Customizable themes
  - Responsive preview

### User Experience
- Real-time preview (as you type)
- Scroll synchronization
- Formatting toolbar
- Keyboard shortcuts
- Export as HTML/Markdown
- Copy HTML/Markdown
- Save to localStorage
- Share via URL
- Dark mode support

## Technical Requirements

### Features to Implement

#### Core Features
1. **Markdown Editor**
   - Text editor with syntax highlighting
   - Line numbers
   - Auto-indentation
   - Bracket matching
   - Undo/redo
   
2. **Live Preview**
   - Real-time Markdown rendering
   - HTML preview
   - Scroll synchronization
   - Syntax highlighting in code blocks
   
3. **Markdown Rendering**
   - Parse Markdown to HTML
   - Support common Markdown features:
     - Headers (# ## ###)
     - Bold (**text**)
     - Italic (*text*)
     - Links [text](url)
     - Images ![alt](url)
     - Code blocks (```)
     - Inline code (`code`)
     - Lists (ordered/unordered)
     - Tables
     - Blockquotes
     - Horizontal rules
   
4. **Toolbar**
   - Formatting buttons:
     - Bold, Italic
     - Headers (H1-H6)
     - Link, Image
     - Code block, Inline code
     - Unordered list, Ordered list
     - Table
     - Blockquote
     - Horizontal rule
   
5. **Export Options**
   - Copy Markdown
   - Copy HTML
   - Download as .md file
   - Download as .html file
   - Share via URL

#### Advanced Features (Phase 2)
- Markdown extensions (GFM)
- Table editor
- Image upload
- Template library
- Markdown cheat sheet
- History/versions
- Collaborative editing

### Component Structure

```
components/MarkdownEditor/
├── MarkdownEditor.tsx           # Main component
├── EditorPane.tsx               # Markdown editor
├── PreviewPane.tsx              # HTML preview
├── Toolbar.tsx                  # Formatting toolbar
├── FormatButton.tsx             # Individual format button
├── ExportOptions.tsx            # Export menu
└── index.ts
```

### Data Structure

#### Markdown Content
```typescript
interface MarkdownContent {
  markdown: string;
  html: string;
  wordCount: number;
  characterCount: number;
}
```

#### Data Files
- `data/tools/markdown-editor/overview.json`
- `data/tools/markdown-editor/instructions.json`
- `data/tools/markdown-editor/examples.json`
- `data/tools/markdown-editor/templates.json` (optional)

## Implementation Steps

### Phase 1: Setup
1. Create component structure
2. Choose Markdown parser (marked.js or remark)
3. Integrate code editor (Monaco or CodeMirror)
4. Create data files
5. Add to `data/tools.json`
6. Create route `app/tools/markdown-editor/page.tsx`

### Phase 2: Core Functionality
1. Implement Markdown editor
2. Build Markdown parser
3. Create HTML preview
4. Add real-time updates
5. Implement scroll sync

### Phase 3: Advanced Features
1. Build formatting toolbar
2. Add export options
3. Implement copy functionality
4. Add save/share
5. Template library (optional)

### Phase 4: Polish
1. Improve syntax highlighting
2. Add example templates
3. Add Markdown cheat sheet
4. Responsive design
5. Dark mode support

## Markdown Features to Support

### Basic Syntax
- Headers (# ## ###)
- Bold (**text**)
- Italic (*text*)
- Links [text](url)
- Images ![alt](url)
- Code blocks (```)
- Inline code (`code`)
- Lists (-, *, 1.)
- Blockquotes (>)
- Horizontal rules (---)

### Extended (Optional)
- Tables
- Strikethrough (~~text~~)
- Task lists (- [ ])
- Emoji (:smile:)
- Math (LaTeX)

## Example Markdown

```markdown
# Heading 1
## Heading 2

**Bold text** and *italic text*

[Link](https://example.com)

![Image](https://example.com/image.png)

- List item 1
- List item 2

\`\`\`javascript
const code = "example";
\`\`\`
```

## SEO & Content

### Meta Tags
- Title: "Markdown Editor - Live Preview Markdown Online"
- Description: "Write and preview Markdown in real-time. Live preview, syntax highlighting, formatting toolbar, and export options."
- Keywords: "markdown editor, markdown preview, live markdown, markdown online, markdown editor online"

### Content for overview.json
- Title: "Markdown Editor"
- Subtitle: "Live preview Markdown editor"
- Description: "Write and preview Markdown in real-time with split-pane editor. Features syntax highlighting, formatting toolbar, export options, and live HTML preview."
- Features: Live preview, Syntax highlighting, Formatting toolbar, Export options, Scroll synchronization, Template library
- Use Cases: Writing documentation, Creating README files, Blog post writing, Markdown learning, Quick formatting

## Success Criteria

- ✅ Renders Markdown correctly
- ✅ Live preview updates smoothly
- ✅ Toolbar inserts formatting
- ✅ Export works (HTML/Markdown)
- ✅ Copy functionality works
- ✅ Scroll sync works
- ✅ Mobile-friendly
- ✅ Fast rendering

## Reference Links

- **StackEdit**: https://stackedit.io/
- **Dillinger**: https://dillinger.io/
- **Marked.js**: https://marked.js.org/
- **CommonMark**: https://commonmark.org/
- **GitHub Flavored Markdown**: https://github.github.com/gfm/

## Notes

- Use marked.js or remark for parsing
- Monaco Editor provides good editing experience
- Scroll synchronization is nice UX feature
- Toolbar makes it accessible
- Export options are valuable
- Consider adding template library
