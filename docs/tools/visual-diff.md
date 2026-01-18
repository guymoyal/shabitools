# Visual Page Compare

> **Note**: This documentation is generated from JSON data files. To update the content, edit the files in `data/tools/visual-diff/`:
> - `overview.json` - Overview, features, use cases
> - `instructions.json` - Usage instructions
> - `examples.json` - Examples

## Overview

Visual Page Compare is a powerful tool that allows you to visually compare two versions of a website side-by-side or using overlay modes. Perfect for testing design changes, spotting differences between production and staging environments, or comparing different versions of a page.

All content for this tool is managed through JSON files in `data/tools/visual-diff/` for easy editing and maintenance.

## Features

- **Side-by-Side Comparison**: View two websites next to each other with synchronized scrolling
- **Overlay Modes**: Three different overlay modes for visual comparison:
  - **Overlay**: Standard overlay with adjustable opacity
  - **Blend**: Difference blend mode that highlights differences in black
  - **Onion**: Onion skin mode with opacity control
- **Viewport Width Selection**: Choose from preset sizes (375px Mobile, 768px Tablet, 1200px Desktop) or set a custom width
- **Synchronized Scrolling**: Both iframes scroll together in side-by-side mode for easy comparison
- **Dark Mode**: Toggle between light and dark themes
- **URL Sharing**: All settings are saved in the URL for easy sharing

## How to Use

### Basic Comparison

1. **Enter URLs**: 
   - Enter the first URL in the "First URL" field
   - Enter the second URL in the "Second URL" field
   - URLs must start with `http://` or `https://`

2. **Select Viewport Width**:
   - Choose from preset sizes: 375px (Mobile), 768px (Tablet), 1200px (Desktop)
   - Or select "Custom" and enter your desired width

3. **Choose Comparison Mode**:
   - **Side by Side**: View both pages next to each other
   - **Overlay**: Stack pages on top of each other

4. **Select Overlay Mode** (when in Overlay comparison mode):
   - **Overlay**: Standard overlay with 50% opacity
   - **Blend**: Difference mode - identical pixels appear black, differences are highlighted
   - **Onion**: Onion skin mode - adjust opacity with the slider

### Advanced Settings

Click the settings icon (⚙️) to access:

- **Show device height**: Display an above-the-fold line indicating the device screen size
- **Check iframe embedding**: Enable warnings for sites that block iframe embedding (X-Frame-Options)

### Opacity Control

When using "Onion" overlay mode:
- Use the slider to adjust opacity from 0% to 100%
- Use the ↑ and ↓ buttons for quick adjustments
- Lower opacity makes it easier to see differences

## Examples

### Example 1: Comparing Production vs Staging

1. Enter production URL: `https://example.com`
2. Enter staging URL: `https://staging.example.com`
3. Select "1200px (Desktop)" viewport
4. Choose "Side by Side" mode
5. Scroll both pages to compare layouts

### Example 2: Mobile vs Desktop View

1. Enter the same URL in both fields
2. Set first viewport to "375px (Mobile)"
3. Set second viewport to "1200px (Desktop)"
4. Use "Side by Side" mode to see responsive differences

### Example 3: Finding Visual Differences

1. Enter both URLs
2. Select "Overlay" comparison mode
3. Choose "Blend" overlay mode
4. Differences will appear highlighted, identical areas will be black

## Use Cases

- **Design QA**: Compare design mockups with implemented pages
- **A/B Testing**: Visual comparison of different page versions
- **Responsive Testing**: Compare mobile and desktop views
- **Bug Verification**: Spot visual regressions between versions
- **Client Reviews**: Share comparison URLs with clients for feedback
- **Performance Testing**: Compare page load states visually

## Tips & Tricks

1. **Synchronized Scrolling**: In side-by-side mode, scrolling one iframe automatically scrolls the other to the same position

2. **URL Sharing**: All your settings (URLs, viewport, mode) are saved in the URL. Share the URL to let others see the same comparison

3. **X-Frame-Options**: Some websites block iframe embedding for security. If you see a warning, try:
   - Disabling the iframe check in settings
   - Using a proxy service
   - Testing with localhost URLs

4. **Blend Mode**: Use blend mode to quickly spot even small pixel differences between pages

5. **Onion Mode**: Adjust opacity gradually to find the optimal comparison view

6. **Custom Widths**: Use custom viewport widths to test specific breakpoints or device sizes

## Limitations

- **X-Frame-Options**: Websites that set `X-Frame-Options: DENY` or `X-Frame-Options: SAMEORIGIN` cannot be embedded in iframes
- **Cross-Origin Restrictions**: Some websites may block iframe embedding for security reasons
- **HTTPS Required**: For best results, use HTTPS URLs to avoid mixed-content warnings
- **Screen Size Detection**: Some websites use JavaScript to detect screen size, which may not work correctly within iframes
- **Interactive Elements**: In overlay mode, interactive elements are disabled to focus on visual comparison

## Related Tools

- [Page Speed Compare](./page-speed-compare.md) - Compare performance metrics between pages
- [Website Visual Diff Compare](./visual-diff.md) - This tool

## Technical Details

- Built with React and Next.js
- Uses iframes for page embedding
- Synchronized scrolling implemented via scroll event listeners
- Blend mode uses CSS `mix-blend-mode: difference`
- All settings persisted in URL parameters

---

**Last Updated**: 2024
