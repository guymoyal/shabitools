# Task 04: API Tester (REST Client) Tool

## Overview

Build a comprehensive REST API testing tool that allows developers to send HTTP requests, view responses, test endpoints, and save request collections. Similar to Postman but web-based and simpler.

## Market Research

### Why This Tool?
- **Essential Tool**: Every developer needs to test APIs
- **SEO Value**: "api tester", "rest client", "http client", "api testing tool"
- **High Demand**: Postman alternatives are popular
- **Developer Pain Point**: Need quick API testing without installing software
- **Multiple Use Cases**: Testing, debugging, documentation, learning

### Reference Tools
- **Postman**: https://www.postman.com/ (Industry standard)
- **Insomnia**: https://insomnia.rest/
- **HTTPie**: https://httpie.io/
- **Thunder Client**: VS Code extension
- **Hoppscotch**: https://hoppscotch.io/ (Open source, web-based)

### Competitive Analysis
- Postman is feature-rich but can be overwhelming
- Hoppscotch is great but could be improved
- Opportunity: Simpler, cleaner UI
- Opportunity: Better mobile experience
- Opportunity: Focus on common use cases
- Opportunity: Shareable requests

## UI/UX Requirements

### Layout
- **Request Builder**:
  - Method selector (GET, POST, PUT, DELETE, PATCH, etc.)
  - URL input with autocomplete
  - Headers editor (key-value pairs)
  - Query parameters builder
  - Request body editor (with format selector: JSON, form-data, raw)
  - Send button
  
- **Response Viewer**:
  - Status code display (color-coded)
  - Response headers
  - Response body (formatted JSON, syntax highlighted)
  - Response time
  - Response size
  - Copy response button

### Visual Design
- **Method Badge**: Color-coded (GET=green, POST=blue, DELETE=red, etc.)
- **Status Code**: Color-coded (2xx=green, 3xx=yellow, 4xx=orange, 5xx=red)
- **Request/Response Split**: Side-by-side or tabs
- **Headers Table**: Clean table with key-value pairs
- **Body Editor**: Syntax highlighting for JSON

### User Experience
- Auto-format JSON responses
- Syntax highlighting for JSON
- Copy request/response buttons
- Save requests (localStorage)
- Share requests via URL
- Request history
- Environment variables support
- Dark mode support
- Keyboard shortcuts (Ctrl+Enter to send)

## Technical Requirements

### Features to Implement

#### Core Features
1. **HTTP Methods**
   - GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
   - Method-specific UI (body only for POST/PUT/PATCH)
   
2. **Request Building**
   - URL input with validation
   - Headers editor (add/remove headers)
   - Query parameters builder
   - Request body editor:
     - JSON (with validation)
     - Form data (key-value pairs)
     - Raw text
     - URL encoded
   
3. **Request Execution**
   - Send HTTP request
   - Show loading state
   - Handle CORS issues
   - Handle timeouts
   - Cancel request
   
4. **Response Display**
   - Status code
   - Response headers
   - Response body (formatted)
   - Response time
   - Response size
   - Error handling
   
5. **Request Management**
   - Save requests (localStorage)
   - Request history
   - Share via URL
   - Copy as cURL
   - Copy as fetch code

#### Advanced Features (Phase 2)
- Authentication (Bearer token, Basic auth, API key)
- Environment variables
- Request collections
- Pre-request scripts
- Response validation
- GraphQL support
- WebSocket support

### Component Structure

```
components/APITester/
├── APITester.tsx               # Main component
├── RequestBuilder.tsx         # Request configuration
├── MethodSelector.tsx         # HTTP method selector
├── HeadersEditor.tsx           # Headers editor
├── BodyEditor.tsx              # Request body editor
├── ResponseViewer.tsx          # Response display
├── RequestHistory.tsx          # Saved requests
├── CodeGenerator.tsx           # Generate code (cURL, fetch)
└── index.ts
```

### Data Structure

#### Request Data
```typescript
interface APIRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  body?: string;
  bodyType: 'json' | 'form-data' | 'raw' | 'url-encoded';
}
```

#### Response Data
```typescript
interface APIResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  size: number;
}
```

#### Data Files
- `data/tools/api-tester/overview.json`
- `data/tools/api-tester/instructions.json`
- `data/tools/api-tester/examples.json`

## Implementation Steps

### Phase 1: Setup
1. Create component structure
2. Create data files
3. Add to `data/tools.json`
4. Create route `app/tools/api-tester/page.tsx`

### Phase 2: Core Functionality
1. Implement request builder UI
2. Build HTTP request sender (using fetch API)
3. Create response viewer
4. Add error handling
5. Implement loading states

### Phase 3: Advanced Features
1. Add headers editor
2. Add query parameters builder
3. Implement body editor with formats
4. Add request history
5. Add copy/share functionality

### Phase 4: Polish
1. Add syntax highlighting
2. Implement code generation (cURL, fetch)
3. Add request saving
4. Responsive design
5. Dark mode support
6. Keyboard shortcuts

## Example Requests

### GET Request
```
GET https://api.github.com/users/octocat
Headers: Accept: application/json
```

### POST Request
```
POST https://api.example.com/users
Headers: Content-Type: application/json
Body: {"name": "John", "email": "john@example.com"}
```

## SEO & Content

### Meta Tags
- Title: "API Tester - REST API Testing Tool Online"
- Description: "Test REST APIs online. Send HTTP requests, view responses, and debug APIs. No installation required."
- Keywords: "api tester, rest client, http client, api testing, postman alternative, rest api tester"

### Content for overview.json
- Title: "API Tester"
- Subtitle: "Test REST APIs online"
- Description: "Comprehensive REST API testing tool for sending HTTP requests, viewing responses, and debugging APIs. Supports all HTTP methods, headers, query parameters, and request bodies."
- Features: All HTTP methods, Headers editor, Query parameters, Request body editor, Response viewer, Request history, Code generation
- Use Cases: Testing APIs, Debugging endpoints, Learning APIs, API documentation, Quick API checks

## Success Criteria

- ✅ Supports all common HTTP methods
- ✅ Sends requests correctly
- ✅ Displays responses properly
- ✅ Handles errors gracefully
- ✅ CORS issues handled (with proxy option or clear messaging)
- ✅ Request history works
- ✅ Copy/share functionality works
- ✅ Mobile-friendly interface

## Reference Links

- **Postman**: https://www.postman.com/
- **Hoppscotch**: https://hoppscotch.io/
- **Insomnia**: https://insomnia.rest/
- **Fetch API**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **cURL**: https://curl.se/

## Notes

- CORS may be an issue - consider proxy or clear messaging
- Use fetch API for requests
- Consider adding proxy option for CORS
- Code generation is valuable feature
- Request history is important for UX
- Consider adding example APIs to test
