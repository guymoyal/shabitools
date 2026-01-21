# Task 02: Regex Tester & Visualizer Tool

## Overview

Build an interactive regular expression tester with real-time matching, visualization, explanation, and a library of common patterns. Helps developers test, debug, and learn regex patterns.

## Market Research

### Why This Tool?
- **High Demand**: Regex is used daily by developers
- **SEO Value**: "regex tester", "regex online", "regex visualizer", "test regex"
- **Developer Pain Point**: Testing regex requires code or external tools
- **Educational Value**: Helps developers learn regex patterns
- **Trending**: Regex testing tools are consistently popular

### Reference Tools
- **Regex101**: https://regex101.com/ (Most popular)
- **Regexr**: https://regexr.com/
- **RegEx Pal**: https://www.regexpal.com/
- **Debuggex**: https://www.debuggex.com/

### Competitive Analysis
- Regex101 is the gold standard but can be overwhelming
- Opportunity: Simpler, cleaner UI
- Opportunity: Better mobile experience
- Opportunity: Pattern library with explanations
- Opportunity: Export/share functionality

## UI/UX Requirements

### Layout
- **Top Section**: 
  - Regex pattern input (large textarea with syntax highlighting)
  - Test string input (large textarea)
  - Flags selector (global, case-insensitive, multiline, etc.)
  
- **Results Section**:
  - Match highlighting in test string
  - Match list with groups and positions
  - Explanation panel (what the regex does)
  - Visual regex tree/diagram (optional)

### Visual Design
- **Pattern Input**:
  - Syntax highlighting for regex
  - Real-time validation
  - Error highlighting for invalid patterns
  - Character counter
  
- **Test String**:
  - Highlighted matches
  - Different colors for different groups
  - Line numbers
  - Scrollable for long strings
  
- **Match List**:
  - Each match with:
    - Full match text
    - Groups (captured groups)
    - Position (start/end index)
    - Match number
  
- **Explanation Panel**:
  - Plain English explanation
  - Breakdown of each part
  - Character class explanations

### User Experience
- Real-time matching as user types
- Copy pattern/test string buttons
- Clear/reset buttons
- Pattern library sidebar
- Save patterns (localStorage)
- Share patterns via URL
- Dark mode support
- Mobile-friendly interface

## Technical Requirements

### Features to Implement

#### Core Features
1. **Regex Engine**
   - Use JavaScript RegExp
   - Support all regex flags (g, i, m, s, u, y)
   - Handle invalid patterns gracefully
   - Show error messages for invalid regex
   
2. **Pattern Matching**
   - Real-time matching
   - Highlight matches in test string
   - Show all matches (not just first)
   - Display captured groups
   - Show match positions
   
3. **Visualization**
   - Highlight matches with different colors
   - Show group boundaries
   - Display match positions
   - Character-by-character explanation
   
4. **Pattern Library**
   - Common patterns (email, URL, phone, etc.)
   - Pre-filled examples
   - Categories (validation, extraction, etc.)
   - One-click to load pattern
   
5. **Explanation System**
   - Break down regex pattern
   - Explain each part
   - Character class meanings
   - Quantifier explanations
   - Group explanations

#### Advanced Features (Phase 2)
- Regex visualizer (tree diagram)
- Replace functionality
- Split functionality
- Pattern history
- Export matches
- Performance testing

### Component Structure

```
components/RegexTester/
├── RegexTester.tsx             # Main component
├── PatternInput.tsx            # Regex pattern input
├── TestStringInput.tsx         # Test string input
├── MatchHighlighter.tsx        # Highlight matches in string
├── MatchList.tsx               # List of matches
├── ExplanationPanel.tsx        # Regex explanation
├── PatternLibrary.tsx           # Pattern library sidebar
├── FlagsSelector.tsx           # Regex flags
└── index.ts
```

### Data Structure

#### Pattern Library Data
```typescript
interface Pattern {
  name: string;
  pattern: string;
  description: string;
  category: string;
  example: string;
  flags: string[];
}
```

#### Match Data
```typescript
interface Match {
  match: string;
  groups: string[];
  index: number;
  input: string;
}
```

#### Data Files
- `data/tools/regex-tester/overview.json`
- `data/tools/regex-tester/instructions.json`
- `data/tools/regex-tester/examples.json`
- `data/tools/regex-tester/patterns.json` (pattern library)

## Implementation Steps

### Phase 1: Setup
1. Create component structure
2. Create data files
3. Add to `data/tools.json`
4. Create route `app/tools/regex-tester/page.tsx`

### Phase 2: Core Functionality
1. Implement pattern input with validation
2. Implement test string input
3. Build regex matching engine
4. Create match highlighting
5. Display match list

### Phase 3: Advanced Features
1. Add flags selector
2. Build explanation system
3. Create pattern library
4. Add group highlighting
5. Implement real-time updates

### Phase 4: Polish
1. Add syntax highlighting
2. Implement copy/share functionality
3. Add pattern saving (localStorage)
4. Responsive design
5. Dark mode support
6. Mobile optimization

## Pattern Library Examples

### Email Validation
- Pattern: `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- Description: Validates email format

### URL Extraction
- Pattern: `https?://[^\s]+`
- Description: Extracts URLs from text

### Phone Number
- Pattern: `^\+?[\d\s\-\(\)]+$`
- Description: Matches phone numbers

### Credit Card
- Pattern: `\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}`
- Description: Matches credit card format

### IP Address
- Pattern: `\b(?:\d{1,3}\.){3}\d{1,3}\b`
- Description: Matches IPv4 addresses

## SEO & Content

### Meta Tags
- Title: "Regex Tester - Test Regular Expressions Online"
- Description: "Test and debug regular expressions in real-time. Visualize matches, get explanations, and access a library of common patterns."
- Keywords: "regex tester, regular expression tester, regex online, test regex, regex visualizer"

### Content for overview.json
- Title: "Regex Tester & Visualizer"
- Subtitle: "Test, debug, and learn regular expressions"
- Description: "Interactive regular expression tester with real-time matching, visualization, and explanations. Test patterns, see matches highlighted, and learn how regex works."
- Features: Real-time matching, Match highlighting, Pattern explanation, Pattern library, Group capture display
- Use Cases: Testing regex patterns, Learning regex, Debugging patterns, Validating input, Extracting data

## Success Criteria

- ✅ Real-time matching works smoothly
- ✅ Matches are clearly highlighted
- ✅ Explanation is accurate and helpful
- ✅ Pattern library is useful
- ✅ Handles invalid patterns gracefully
- ✅ Mobile-friendly interface
- ✅ Fast and responsive
- ✅ Copy/share functionality works

## Reference Links

- **Regex101**: https://regex101.com/
- **Regexr**: https://regexr.com/
- **MDN RegExp**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
- **Regex Tutorial**: https://www.regular-expressions.info/

## Notes

- Use client-side JavaScript RegExp (no API needed)
- Consider using a regex visualization library
- Pattern library should be comprehensive
- Explanation system is key differentiator
- Consider adding regex cheat sheet
