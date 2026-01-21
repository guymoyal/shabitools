# Task 01: Page Speed Compare Tool

## Overview

Build a tool that compares page speed metrics between multiple URLs using Google PageSpeed Insights API. Users can compare performance scores, Core Web Vitals, and detailed metrics side-by-side.

## Market Research

### Why This Tool?
- **High Demand**: Developers constantly need to compare staging vs production performance
- **SEO Value**: "page speed test", "lighthouse compare", "website performance comparison"
- **Developer Pain Point**: No easy way to compare multiple URLs side-by-side
- **Trending**: Performance optimization is critical in 2024-2025

### Reference Tools
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **WebPageTest**: https://www.webpagetest.org/
- **Lighthouse CI**: https://github.com/GoogleChrome/lighthouse-ci

### Competitive Analysis
- Most tools only test one URL at a time
- Opportunity: Side-by-side comparison of multiple URLs
- Opportunity: Historical tracking and trends
- Opportunity: Mobile + Desktop comparison in one view

## UI/UX Requirements

### Layout
- **Input Section**: 
  - Two URL input fields (can expand to 3-4)
  - Device selector (Mobile/Desktop)
  - "Compare" button
  - Clear/reset button
  
- **Results Section**:
  - Side-by-side cards for each URL
  - Loading states with progress indicators
  - Error handling for invalid URLs or API failures

### Visual Design
- **Score Display**: Large, color-coded scores (green: 90+, yellow: 50-89, red: <50)
- **Metrics Cards**: Clean cards showing:
  - Performance Score (0-100)
  - First Contentful Paint (FCP)
  - Largest Contentful Paint (LCP)
  - Cumulative Layout Shift (CLS)
  - Total Blocking Time (TBT)
  - Speed Index
  
- **Comparison View**: 
  - Visual bars comparing metrics
  - Color coding for better/worse
  - Percentage differences highlighted

### User Experience
- Real-time loading feedback
- Ability to save/share comparison URLs
- Export results as JSON/CSV
- Copy individual scores/metrics
- Responsive design (mobile-friendly)
- Dark mode support

## Technical Requirements

### API Integration
- **Google PageSpeed Insights API**
  - Endpoint: `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`
  - Requires API key (store in environment variables)
  - Rate limits: 25,000 requests per day (free tier)
  
- **Alternative**: Use Lighthouse programmatically (client-side or server-side)

### Features to Implement

#### Core Features
1. **URL Input & Validation**
   - Validate URL format
   - Support http/https
   - Handle invalid URLs gracefully
   
2. **Performance Testing**
   - Test Mobile performance
   - Test Desktop performance
   - Show loading states
   - Handle API errors
   
3. **Metrics Display**
   - Performance score (0-100)
   - Core Web Vitals:
     - LCP (Largest Contentful Paint)
     - FID (First Input Delay) / INP (Interaction to Next Paint)
     - CLS (Cumulative Layout Shift)
   - Additional metrics:
     - FCP (First Contentful Paint)
     - TBT (Total Blocking Time)
     - Speed Index
     - Time to Interactive (TTI)
   
4. **Comparison Visualization**
   - Side-by-side metric comparison
   - Visual bars/charts
   - Color-coded differences
   - "Winner" indicators
   
5. **Results Management**
   - Save comparison (localStorage)
   - Shareable URL with results
   - Export as JSON/CSV
   - Copy individual metrics

#### Advanced Features (Phase 2)
- Historical tracking
- Performance budgets
- Recommendations for improvement
- Screenshot comparison
- Waterfall charts

### Component Structure

```
components/PageSpeedCompare/
├── PageSpeedCompare.tsx       # Main component
├── URLInput.tsx                # URL input fields
├── ResultsCard.tsx             # Individual result card
├── MetricsDisplay.tsx          # Metrics visualization
├── ComparisonView.tsx          # Side-by-side comparison
├── ScoreBadge.tsx              # Score display component
└── index.ts
```

### Data Structure

#### API Response Handling
```typescript
interface PageSpeedResult {
  url: string;
  score: number;
  metrics: {
    lcp: number;
    fid: number;
    cls: number;
    fcp: number;
    tbt: number;
    speedIndex: number;
  };
  opportunities: Array<{
    title: string;
    description: string;
    score: number;
  }>;
  diagnostics: Array<{
    title: string;
    description: string;
  }>;
}
```

#### Data Files
- `data/tools/page-speed-compare/overview.json`
- `data/tools/page-speed-compare/instructions.json`
- `data/tools/page-speed-compare/examples.json`

## Implementation Steps

### Phase 1: Setup
1. Create component structure
2. Set up API integration (PageSpeed Insights)
3. Create data files (overview, instructions, examples)
4. Add to `data/tools.json`
5. Create route `app/tools/page-speed-compare/page.tsx`

### Phase 2: Core Functionality
1. Implement URL input with validation
2. Create API service for PageSpeed Insights
3. Build results card component
4. Display metrics with proper formatting
5. Add loading and error states

### Phase 3: Comparison Features
1. Build side-by-side comparison view
2. Add visual comparison bars
3. Implement color coding
4. Add difference calculations

### Phase 4: Polish
1. Add export functionality
2. Implement shareable URLs
3. Add copy to clipboard
4. Responsive design optimization
5. Dark mode support

## SEO & Content

### Meta Tags
- Title: "Page Speed Compare - Test & Compare Website Performance"
- Description: "Compare page speed metrics between multiple URLs. Analyze Core Web Vitals, performance scores, and optimization opportunities."
- Keywords: "page speed test, lighthouse compare, website performance, core web vitals, performance comparison"

### Content for overview.json
- Title: "Page Speed Compare"
- Subtitle: "Compare performance metrics between multiple websites"
- Description: "Test and compare page speed metrics between URLs using Google PageSpeed Insights. Analyze Core Web Vitals, performance scores, and get optimization recommendations."
- Features: Performance comparison, Core Web Vitals analysis, Mobile/Desktop testing, Export results
- Use Cases: Staging vs Production comparison, A/B testing performance, Competitor analysis, Performance monitoring

## Success Criteria

- ✅ Users can compare 2-4 URLs simultaneously
- ✅ Results display within 10-15 seconds
- ✅ Clear visual comparison of metrics
- ✅ Mobile and desktop results available
- ✅ Export/share functionality works
- ✅ Responsive and accessible
- ✅ Error handling for API failures
- ✅ Loading states provide good UX

## Reference Links

- **PageSpeed Insights API**: https://developers.google.com/speed/docs/insights/v5/get-started
- **Core Web Vitals**: https://web.dev/vitals/
- **Lighthouse Scoring**: https://web.dev/performance-scoring/
- **Similar Tools**:
  - https://pagespeed.web.dev/
  - https://gtmetrix.com/
  - https://www.webpagetest.org/

## Notes

- API key required - store in environment variables
- Consider rate limiting and caching
- May need server-side API route to hide API key
- Consider using Lighthouse programmatically as alternative
- Add retry logic for failed requests
